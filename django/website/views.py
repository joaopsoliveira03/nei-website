from django.contrib.auth.models import User, Group
from rest_framework import viewsets, permissions, mixins
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import *
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
import base64

class CreateOnlyModelViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
  pass

class CreateAndViewModelViewSet(mixins.CreateModelMixin, viewsets.ReadOnlyModelViewSet):
  pass

class ContactViewSet(CreateOnlyModelViewSet):
  """
  API endpoint that allows people to contact us.
  """
  queryset = ContactModel.objects.all()
  serializer_class = ContactSerializer
  permission_classes = []

class FAQViewSet(viewsets.ReadOnlyModelViewSet):
  """
  API endpoint that allows FAQs to be viewed.
  """
  queryset = FAQModel.objects.all()
  serializer_class = FAQSerializer
  permission_classes = []
  filterset_fields = FAQSerializer.Meta.fields
  pagination_class = None

class CalendarViewSet(CreateAndViewModelViewSet):
  """
  API endpoint that allows calendar events to be viewed or created.
  """
  queryset = CalendarModel.objects.filter(visible=True)
  serializer_class = CalendarSerializer
  permission_classes = [permissions.DjangoModelPermissionsOrAnonReadOnly]
  filterset_fields = CalendarSerializer.Meta.fields
  pagination_class = None
  
  def create(self, request, *args, **kwargs):
    curricularUnitJson = request.data.get('curricularUnit', None)
    if curricularUnitJson:
      curricularUnit = CurricularUnitModel.objects.get(id=curricularUnitJson.get('id', None))
      if curricularUnit:
        serializer = CalendarSerializer(data=request.data)
        if serializer.is_valid():
          serializer.save(curricularUnit=curricularUnit)
          return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return super().create(request, *args, **kwargs)

class CourseViewSet(viewsets.ReadOnlyModelViewSet):
  """
  API endpoint that allows courses to be viewed.
  """
  queryset = CourseModel.objects.all()
  serializer_class = CourseSerializer
  permission_classes = []
  filterset_fields = CourseSerializer.Meta.fields
  pagination_class = None
  
  #* Append the curricular units to each course in the list
  def list(self, request, *args, **kwargs):
    queryset = self.get_queryset()
    serializer = CourseSerializer(queryset, many=True)
    data = serializer.data
    for i in range(len(data)):
      data[i]['curricularUnits'] = CurricularUnitSerializer(CurricularUnitModel.objects.filter(course__abbreviation=data[i]['abbreviation']), many=True).data
    return Response(data)

class CurricularUnitViewSet(viewsets.ReadOnlyModelViewSet):
  """
  API endpoint that allows curricular units to be viewed.
  """
  queryset = CurricularUnitModel.objects.all()
  serializer_class = CurricularUnitSerializer
  permission_classes = []
  filterset_fields = CurricularUnitSerializer.Meta.fields
  pagination_class = None

class MaterialTagViewSet(viewsets.ReadOnlyModelViewSet):
  """
  API endpoint that allows material tags to be viewed.
  """
  queryset = MaterialTagModel.objects.all()
  serializer_class = MaterialTagSerializer
  permission_classes = []
  filterset_fields = MaterialTagSerializer.Meta.fields
  pagination_class = None

class MaterialViewSet(CreateAndViewModelViewSet):
  """
  API endpoint that allows materials to be viewed or edited.
  """
  queryset = MaterialModel.objects.filter(visible=True)
  serializer_class = MaterialSerializer
  permission_classes = [permissions.DjangoModelPermissionsOrAnonReadOnly]
  filterset_fields = ['name', 'tags', 'curricularUnit']
  pagination_class = None

  def create(self, request, *args, **kwargs): #TODO: Improve this method
    fileJson = request.data.get('file', None)
    curricularUnitJson = request.data.get('curricularUnit', None)
    
    #Check if we have a curricular unit
    if not curricularUnitJson:
      return Response({'detail': 'Curricular Unit JSON not found.'}, status=status.HTTP_400_BAD_REQUEST)
    
    curricularUnit = CurricularUnitModel.objects.get(id=curricularUnitJson.get('id', None))
    
    if not curricularUnit:
      return Response({'detail': 'Curricular Unit not found.'}, status=status.HTTP_400_BAD_REQUEST)
    
    if not fileJson and not request.data.get('link', None):
      return Response({'detail': 'File or link not found.'}, status=status.HTTP_400_BAD_REQUEST)
    
    courses = curricularUnit.course.all()
    
    tagsJson = request.data.get('tags', [])
    if not tagsJson:
      return Response({'detail': 'Tags JSON not found.'}, status=status.HTTP_400_BAD_REQUEST)
    
    tags = []
    for tagJson in tagsJson:
      tag = MaterialTagModel.objects.get(name=tagJson.get('name', None))
      if tag:
        tags.append(tag)
      else:
        return Response({'detail': 'Tag not found.'}, status=status.HTTP_400_BAD_REQUEST)
    
    material = None

    if fileJson:
      fileSplit = fileJson.split(":")
      fileName = fileSplit[0]
      decodedFile = base64.b64decode(fileSplit[1])
      
      #if the curricular unit has more than one course it should be Abbreviation + Abbreviation + ...
      if len(courses) > 1:
        course = " + ".join([course.abbreviation for course in courses])
      else:
        course = courses[0].abbreviation
      
      filePath = f"{course}/{curricularUnit.abbreviation}/{request.user.username}/{fileName}"
      
      default_storage.save(filePath, ContentFile(decodedFile))
      
      material = MaterialModel.objects.create(name=request.data.get('name', ''), file=filePath, curricularUnit=curricularUnit)
    else:
      material = MaterialModel.objects.create(name=request.data.get('name', ''), link=request.data.get('link', ''), curricularUnit=curricularUnit)
    
    material.tags.set(tags)
    return Response(MaterialSerializer(material).data, status=status.HTTP_201_CREATED)


class MentoringRequestViewSet(CreateAndViewModelViewSet):
  """
  API endpoint that allows mentorship requests to be viewed or edited.
  """
  queryset = MentoringRequestModel.objects.all()
  serializer_class = MentoringRequestSerializer
  permission_classes = [permissions.DjangoObjectPermissions]
  filterset_fields = MentoringRequestSerializer.Meta.fields
  pagination_class = None

  #* Hide users from requests
  def retrieve(self, request, *args, **kwargs):
    queryset = self.get_queryset()
    serializer = MentoringRequestSerializer(queryset, many=True)
    data = serializer.data
    newData = []
    for i in range(len(data)):
      if data[i]['mentee']['id'] != request.user.id:
        data[i]['mentee'] = None
        newData.append(data[i])
    return Response(newData)
  
  #* Hide users from requests
  def list(self, request, *args, **kwargs):
    queryset = self.get_queryset()
    serializer = MentoringRequestSerializer(queryset, many=True)
    data = serializer.data
    newData = []
    for i in range(len(data)):
      if data[i]['mentee']['id'] != request.user.id:
        data[i]['mentee'] = None
        newData.append(data[i])
    return Response(newData)

  #* Create Mentoring Request
  def create(self, request, *args, **kwargs):
    curricularUnitJson = request.data.get('curricularUnit', None)
    if curricularUnitJson:
      curricularUnit = CurricularUnitModel.objects.get(id=curricularUnitJson.get('id', None))
      if curricularUnit:
        serializer = MentoringRequestSerializer(data=request.data)
        if serializer.is_valid():
          serializer.save(mentee=request.user, curricularUnit=curricularUnit)
          return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
          return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response({'detail': 'Curricular Unit JSON not found.'}, status=status.HTTP_400_BAD_REQUEST)

class MentoringViewSet(CreateAndViewModelViewSet):
  """
  API endpoint that allows mentorships to be viewed or edited.
  """
  queryset = MentoringModel.objects.all()
  serializer_class = MentoringSerializer
  permission_classes = [permissions.DjangoObjectPermissions]
  filterset_fields = MentoringSerializer.Meta.fields
  pagination_class = None
  
  #* Limit so that is only possible to see the same user
  def get_queryset(self):
    return MentoringModel.objects.filter(mentor=self.request.user) | MentoringModel.objects.filter(mentee=self.request.user)

  #* Create Mentoring
  @transaction.atomic
  def create(self, request, *args, **kwargs):
    if 'requestId' not in self.request.data:
      return Response({'detail': 'Request ID not found.'}, status=status.HTTP_400_BAD_REQUEST)
    mentoringRequest = MentoringRequestModel.objects.get(id=self.request.data.get('requestId', None))
    
    if not mentoringRequest:
      return Response({'detail': 'Request not found.'}, status=status.HTTP_400_BAD_REQUEST)
    
    if mentoringRequest.mentee == request.user:
      return Response({'detail': 'You cannot mentor yourself.'}, status=status.HTTP_400_BAD_REQUEST)
    
    #TODO: check if the courses of the curricular unit matches one course of the user
    
    mentoring = MentoringModel.objects.create(mentee=mentoringRequest.mentee, mentor=request.user, curricularUnit=mentoringRequest.curricularUnit)
    mentoringRequest.delete()
    
    return Response(MentoringSerializer(mentoring).data, status=status.HTTP_201_CREATED)

class BlogTopicViewSet(viewsets.ReadOnlyModelViewSet):
  """
  API endpoint that allows blog topics to be viewed.
  """
  queryset = BlogTopicModel.objects.all()
  serializer_class = BlogTopicSerializer
  permission_classes = []
  filterset_fields = BlogTopicSerializer.Meta.fields
  pagination_class = None

class BlogImageViewSet(viewsets.ReadOnlyModelViewSet):
  """
  API endpoint that allows blog images to be viewed.
  """
  queryset = BlogImageModel.objects.all()
  serializer_class = BlogImageSerializer
  permission_classes = []
  filterset_fields = ['name']
  pagination_class = None

class BlogPostViewSet(viewsets.ReadOnlyModelViewSet):
  """
  API endpoint that allows blog posts to be viewed.
  """
  queryset = BlogPostModel.objects.all().order_by('-date')
  serializer_class = BlogPostSerializer
  permission_classes = []
  filterset_fields = BlogPostSerializer.Meta.fields

class UserViewSet(CreateAndViewModelViewSet, mixins.UpdateModelMixin):
  """
  API endpoint that allows users to be viewed or edited.
  """
  queryset = User.objects.all()
  serializer_class = UserSerializer
  permission_classes = []
  filterset_fields = ['id', 'username', 'first_name', 'last_name', 'email']
  pagination_class = None
  
  #* Limit so that is only possible to see the same user
  def get_queryset(self):
    return User.objects.filter(id=self.request.user.id)
  
  #TODO: Adjust and test this method
  def update(self, request, *args, **kwargs):
    user = User.objects.get(id=request.user.id)
    profilemodel = request.data.pop('profilemodel', None)
    user.first_name = request.data.get('first_name', user.first_name)
    user.last_name = request.data.get('last_name', user.last_namee)
    user.email = request.data.get('email', user.email)
    user.save()
    if profilemodel:
      user.profilemodel.course = profilemodel.get('course', user.profilemodel.course)
      user.profilemodel.year = profilemodel.get('year', user.profilemodel.year)
      user.profilemodel.image = profilemodel.get('image', user.profilemodel.image)
      user.profilemodel.save()
    return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
  
  #TODO: Adjust and test this method
  def partial_update(self, request, *args, **kwargs):
    user = User.objects.get(id=request.user.id)
    user.first_name = request.data.get('first_name', user.first_name)
    user.last_name = request.data.get('last_name', user.last_name)
    user.email = request.data.get('email', user.email)
    profilemodel = request.data.get('profilemodel', None)
    user.save()
    if profilemodel:
      user.profilemodel.course = profilemodel.get('course', user.profilemodel.course)
      user.profilemodel.year = profilemodel.get('year', user.profilemodel.year)
      user.profilemodel.image = profilemodel.get('image', user.profilemodel.image)
      user.profilemodel.save()
    return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
