from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model

User = get_user_model()

class AuthAPITests(APITestCase):
    def setUp(self):
        self.register_url = reverse('register')
        self.login_url = reverse('login')
        self.me_url = reverse('profile-me')
        
        self.user_data = {
            'email': 'testuser@sentinel.com',
            'username': 'testuser',
            'password': 'StrongPassword123!',
            'password_confirm': 'StrongPassword123!'
        }

    def test_user_registration(self):
        """
        Ensure we can register a new user object.
        """
        response = self.client.post(self.register_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue('id' in response.data['data'])
        self.assertEqual(response.data['data']['email'], self.user_data['email'])

    def test_user_login(self):
        """
        Ensure we can log in and receive tokens.
        """
        # First register
        self.client.post(self.register_url, self.user_data)
        
        # Then login
        login_data = {
            'email': self.user_data['email'],
            'password': self.user_data['password']
        }
        response = self.client.post(self.login_url, login_data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('tokens' in response.data)
        self.assertTrue('access' in response.data['tokens'])
        self.assertTrue('refresh' in response.data['tokens'])
        self.assertEqual(response.data['user']['email'], self.user_data['email'])

    def test_authenticated_profile_access(self):
        """
        Ensure users can access /me/ endpoint using valid token
        """
        self.client.post(self.register_url, self.user_data)
        login_response = self.client.post(self.login_url, {
            'email': self.user_data['email'],
            'password': self.user_data['password']
        })
        
        access_token = login_response.data['tokens']['access']
        
        # Use token to access profile
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)
        response = self.client.get(self.me_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['email'], self.user_data['email'])

    def test_unauthorized_profile_access(self):
        """
        Ensure unauthenticated requests are blocked.
        """
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
