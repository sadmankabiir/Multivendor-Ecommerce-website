from django.shortcuts import render


from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status


from userauths.models import Profile, User
from userauths.serializer import MyTokenObtainPairSerializer, ProfileSerializer, RegisterSerializer, UserSerializer

import random
import shortuuid


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

def generate_otp():
        uuid_key = shortuuid.uuid()
        unique_key = uuid_key[:6]
        return unique_key

class PasswordResetEmailVerify(generics.RetrieveAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

    def get_object(self):
        email = self.kwargs['email']
        user = User.objects.get(email=email)

        print("user =====", user)

        if user:
             user.otp = generate_otp()
             user.save()

             uidb64 = user.pk
             otp = user.otp

             link = f"http://localhost:5173/create-new-password?otp={otp}&uidb64={uidb64}"

             print("link =====", link)

        return user


class PasswordChangeView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserSerializer

    def create(self, request):
        payload = request.data
        
        otp = payload['otp']
        uidb64 = payload['uidb64']
        password = payload['password']

        user = User.objects.get( otp=otp, id=uidb64)
        if user:
            user.set_password(password)
            user.otp = ""
            user.save()
            return Response( {"message": "Password Changed Successfully"}, status=status.HTTP_201_CREATED)
        else:
            return Response( {"message": "User Does Not Exists"}, status=status.HTTP_400_NOT_FOUND)
        

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        user_id = self.kwargs['user_id']

        user = User.objects.get(id=user_id)
        profile = Profile.objects.get(user=user)
        return profile

