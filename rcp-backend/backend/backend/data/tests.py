from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from data.models.machineType import MachineType
from data.models.machine import Machine
from data.models.element import Element
from data.models.timeEntry import TimeEntry

User = get_user_model()

# -------------------------------------------
# Testy dla MachineType
# -------------------------------------------
class MachineTypeEndpointTests(APITestCase):
    def setUp(self):
        self.tech = User.objects.create_user(username='tech1', password='pass123', role='technical')
        self.employee = User.objects.create_user(username='emp1', password='pass123', role='employee')
        self.client.force_authenticate(user=self.tech)
        self.url = '/api/machine-types/'
        self.type1 = MachineType.objects.create(type_name='TestType')

    # --- Pozytywne ---
    def test_create_valid(self):
        response = self.client.post(self.url, {'type_name': 'Frezarka'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_patch_valid(self):
        response = self.client.patch(f'{self.url}{self.type1.id}/', {'type_name': 'Zmieniona'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.type1.refresh_from_db()
        self.assertEqual(self.type1.type_name, 'Zmieniona')

    def test_delete_valid(self):
        response = self.client.delete(f'{self.url}{self.type1.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    # --- Negatywne ---
    def test_create_empty_name(self):
        response = self.client.post(self.url, {'type_name': ''})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_whitespace_name(self):
        response = self.client.post(self.url, {'type_name': '   '})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_missing_name(self):
        response = self.client.post(self.url, {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_name_too_long(self):
        long_name = 'a' * 256
        response = self.client.post(self.url, {'type_name': long_name})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_patch_nonexistent(self):
        response = self.client.patch('/api/machine-types/9999/', {'type_name': 'Test'})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_nonexistent(self):
        response = self.client.delete('/api/machine-types/9999/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_employee_cannot_create(self):
        self.client.force_authenticate(user=self.employee)
        response = self.client.post(self.url, {'type_name': 'Probna'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


# -------------------------------------------
# Testy dla Machine
# -------------------------------------------
class MachineEndpointTests(APITestCase):
    def setUp(self):
        self.tech = User.objects.create_user(username='tech2', password='pass123', role='technical')
        self.employee = User.objects.create_user(username='emp2', password='pass123', role='employee')
        self.client.force_authenticate(user=self.tech)
        self.type1 = MachineType.objects.create(type_name='Tokarka')
        self.machine1 = Machine.objects.create(machine_name='Maszyna1', id_type=self.type1)
        self.url = '/api/machines/'

    def test_create_valid(self):
        response = self.client.post(self.url, {'machine_name': 'Nowa', 'id_type': self.type1.id})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_patch_valid(self):
        response = self.client.patch(f'{self.url}{self.machine1.id}/', {'machine_name': 'Zmieniona'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_valid(self):
        response = self.client.delete(f'{self.url}{self.machine1.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_create_nonexistent_type(self):
        response = self.client.post(self.url, {'machine_name': 'Test', 'id_type': 9999})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_missing_name(self):
        response = self.client.post(self.url, {'id_type': self.type1.id})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_blank_name(self):
        response = self.client.post(self.url, {'machine_name': '', 'id_type': self.type1.id})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_whitespace_name(self):
        response = self.client.post(self.url, {'machine_name': '   ', 'id_type': self.type1.id})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_patch_nonexistent_machine(self):
        response = self.client.patch('/api/machines/9999/', {'machine_name': 'Nowa'})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_employee_cannot_create(self):
        self.client.force_authenticate(user=self.employee)
        response = self.client.post(self.url, {'machine_name': 'X', 'id_type': self.type1.id})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


# -------------------------------------------
# Testy dla Element
# -------------------------------------------
class ElementEndpointTests(APITestCase):
    def setUp(self):
        self.tech = User.objects.create_user(username='tech3', password='pass123', role='technical')
        self.employee = User.objects.create_user(username='emp3', password='pass123', role='employee')
        self.client.force_authenticate(user=self.tech)
        self.type1 = MachineType.objects.create(type_name='Wiertarka')
        self.element1 = Element.objects.create(
            element_name='Szyba', id_type=self.type1, estimated_time_per_item=5
        )
        self.url = '/api/elements/'

    def test_create_valid(self):
        response = self.client.post(self.url, {
            'element_name': 'Blat',
            'id_type': self.type1.id,
            'estimated_time_per_item': 10
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_patch_valid(self):
        response = self.client.patch(f'{self.url}{self.element1.id}/', {'element_name': 'Szyba hartowana'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_valid(self):
        response = self.client.delete(f'{self.url}{self.element1.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_create_with_zero_time(self):
        response = self.client.post(self.url, {
            'element_name': 'Blat', 'id_type': self.type1.id, 'estimated_time_per_item': 0
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_with_negative_time(self):
        response = self.client.post(self.url, {
            'element_name': 'Blat', 'id_type': self.type1.id, 'estimated_time_per_item': -5
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_missing_time(self):
        response = self.client.post(self.url, {
            'element_name': 'Blat', 'id_type': self.type1.id
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_empty_element_name(self):
        response = self.client.post(self.url, {
            'element_name': '', 'id_type': self.type1.id, 'estimated_time_per_item': 10
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_whitespace_element_name(self):
        response = self.client.post(self.url, {
            'element_name': '   ', 'id_type': self.type1.id, 'estimated_time_per_item': 10
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_nonexistent_type(self):
        response = self.client.post(self.url, {
            'element_name': 'Okno', 'id_type': 9999, 'estimated_time_per_item': 10
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_patch_nonexistent_element(self):
        response = self.client.patch('/api/elements/9999/', {'element_name': 'Nowy'})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_employee_cannot_create(self):
        self.client.force_authenticate(user=self.employee)
        response = self.client.post(self.url, {
            'element_name': 'Test', 'id_type': self.type1.id, 'estimated_time_per_item': 10
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


# -------------------------------------------
# Testy dla TimeEntry
# -------------------------------------------
class TimeEntryEndpointTests(APITestCase):
    def setUp(self):
        self.employee = User.objects.create_user(username='emp4', password='pass123', role='employee')
        self.other_employee = User.objects.create_user(username='emp5', password='pass123', role='employee')
        self.type1 = MachineType.objects.create(type_name='Typ')
        self.machine1 = Machine.objects.create(machine_name='Maszyna', id_type=self.type1)
        self.element1 = Element.objects.create(
            element_name='Element1', id_type=self.type1, estimated_time_per_item=5
        )
        self.url = '/api/time-entries/'

    def test_create_valid(self):
        self.client.force_authenticate(user=self.employee)
        response = self.client.post(self.url, {
            'machine': self.machine1.id,
            'start_time': '2026-05-12T08:00:00Z',
            'amount_of_elements': 2
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(TimeEntry.objects.count(), 1)
        entry = TimeEntry.objects.first()
        self.assertEqual(entry.user, self.employee)

    def test_create_with_element(self):
        self.client.force_authenticate(user=self.employee)
        response = self.client.post(self.url, {
            'machine': self.machine1.id,
            'element': self.element1.id,
            'start_time': '2026-05-12T08:00:00Z',
            'amount_of_elements': 3
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_missing_machine(self):
        self.client.force_authenticate(user=self.employee)
        response = self.client.post(self.url, {
            'start_time': '2026-05-12T08:00:00Z'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_missing_start_time(self):
        self.client.force_authenticate(user=self.employee)
        response = self.client.post(self.url, {
            'machine': self.machine1.id
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_nonexistent_machine(self):
        self.client.force_authenticate(user=self.employee)
        response = self.client.post(self.url, {
            'machine': 9999,
            'start_time': '2026-05-12T08:00:00Z'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_negative_amount_of_elements(self):
        self.client.force_authenticate(user=self.employee)
        response = self.client.post(self.url, {
            'machine': self.machine1.id,
            'start_time': '2026-05-12T08:00:00Z',
            'amount_of_elements': -5
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_zero_amount(self):
        self.client.force_authenticate(user=self.employee)
        response = self.client.post(self.url, {
            'machine': self.machine1.id,
            'start_time': '2026-05-12T08:00:00Z',
            'amount_of_elements': 0
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_only_own_entries(self):
        self.client.force_authenticate(user=self.employee)
        self.client.post(self.url, {
            'machine': self.machine1.id,
            'start_time': '2026-05-12T08:00:00Z',
            'amount_of_elements': 1
        })
        self.client.force_authenticate(user=self.other_employee)
        self.client.post(self.url, {
            'machine': self.machine1.id,
            'start_time': '2026-05-12T09:00:00Z',
            'amount_of_elements': 1
        })
        self.client.force_authenticate(user=self.employee)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['user'], self.employee.id)

    def test_patch_own_entry(self):
        self.client.force_authenticate(user=self.employee)
        entry = TimeEntry.objects.create(
            user=self.employee, machine=self.machine1,
            start_time='2026-05-12T08:00:00Z', amount_of_elements=1
        )
        response = self.client.patch(f'{self.url}{entry.id}/', {'amount_of_elements': 5})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_patch_other_entry_returns_404(self):
        entry = TimeEntry.objects.create(
            user=self.other_employee, machine=self.machine1,
            start_time='2026-05-12T08:00:00Z', amount_of_elements=1
        )
        self.client.force_authenticate(user=self.employee)
        response = self.client.patch(f'{self.url}{entry.id}/', {'amount_of_elements': 5})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_own_entry(self):
        self.client.force_authenticate(user=self.employee)
        entry = TimeEntry.objects.create(
            user=self.employee, machine=self.machine1,
            start_time='2026-05-12T08:00:00Z', amount_of_elements=1
        )
        response = self.client.delete(f'{self.url}{entry.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_other_entry_returns_404(self):
        entry = TimeEntry.objects.create(
            user=self.other_employee, machine=self.machine1,
            start_time='2026-05-12T08:00:00Z', amount_of_elements=1
        )
        self.client.force_authenticate(user=self.employee)
        response = self.client.delete(f'{self.url}{entry.id}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_tech_cannot_create(self):
        tech = User.objects.create_user(username='tech4', password='pass123', role='technical')
        self.client.force_authenticate(user=tech)
        response = self.client.post(self.url, {
            'machine': self.machine1.id,
            'start_time': '2026-05-12T08:00:00Z',
            'amount_of_elements': 1
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
