// src/stores/employeeStore.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const useEmployeeStore = defineStore('employee', {
  state: () => ({
    employees: [], // 儲存員工列表
    employeeDetail: null, // 儲存單個員工詳細資料
    isLoading: false, // 載入狀態
    error: null, // 錯誤訊息
  }),

  actions: {
    async fetchEmployees() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.get('/api/employees'); // 使用代理路徑
        console.log('API Response:', response.data);
        // 確保 response.data 是陣列
        const data = Array.isArray(response.data) ? response.data : [];
        this.employees = data.map(emp => ({
          id: emp.employeeId, // 映射 employeeId 為 id
          name: emp.name || '',
          district: emp.district || '',
          price: emp.price || 0,
          employee_photo: emp.employeeImage || '', // 映射 employeeImage 為 employee_photo
          petTypes: Array.isArray(emp.petTypes)
            ? emp.petTypes
            : typeof emp.petTypes === 'string'
              ? emp.petTypes.split(',').map(p => p.trim())
              : [],
        }));
      } catch (err) {
        this.error = err.response?.data?.message || '無法載入員工資料，請稍後再試';
        console.error('Error fetching employees:', err);
        this.employees = []; // 錯誤時設為空陣列
      } finally {
        this.isLoading = false;
      }
    },
    // [新增] 添加 fetchEmployeeDetail 方法以獲取單個員工詳細資料
      async fetchEmployeeDetail(id) {
        this.isLoading = true;
        this.error = null;
        this.employeeDetail = null;
        try {
          const response = await axios.get(`/api/employees/${id}`);
          console.log('Employee Detail API Response:', response.data);
          const emp = response.data;
          this.employeeDetail = {
            id: emp.id,
            name: emp.name || '',
            district: emp.district || '',
            price: emp.price || 0,
            employee_photo: emp.employeeImage || '',
            petTypes: emp.petTypes || [],
            petSizes: emp.petSizes || [],
            distance: emp.distance || 0,
            descriptionShort: emp.descriptionShort || '',
            description: emp.description || '',
            carousel: emp.carousel || [],
            latitude: emp.latitude || 0,
            longitude: emp.longitude || 0,
            map: emp.map || '',
            availableTime: ['8:00-9:00', '09:00-10:00', '10:00-11:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00'], // 硬編碼
          };
        } catch (err) {
          this.error = err.response?.data?.message || '無法載入員工詳細資料，請稍後再試';
          console.error('Error fetching employee detail:', err);
          this.employeeDetail = null;
        } finally {
          this.isLoading = false;
        }
      },
      //篩選
      async filterEmployees(filters) {
        this.isLoading = true;
        this.error = null;
        try {
          const response = await axios.post('/api/employees/filter', filters);
          console.log('Filter API Response:', response.data);
          const data = Array.isArray(response.data) ? response.data : [];
          this.employees = data.map(emp => ({
            id: emp.employeeId,
            name: emp.name || '',
            district: emp.district || '',
            price: emp.price || 0,
            employee_photo: emp.employeeImage || '',
            petTypes: Array.isArray(emp.petTypes)
              ? emp.petTypes
              : typeof emp.petTypes === 'string'
                ? emp.petTypes.split(',').map(p => p.trim())
                : [],
          }));
        } catch (err) {
          this.error = err.response?.data?.message || '無法篩選員工資料，請稍後再試';
          console.error('Error filtering employees:', err);
          this.employees = [];
        } finally {
          this.isLoading = false;
        }
      },
    },

    getters: {
      filteredEmployees: state => state.employees,
      districts: state => [...new Set(state.employees.map(emp => emp.district))].filter(Boolean),
      petTypes: state => {
        const petTypesSet = new Set();
        state.employees.forEach(emp => {
          if (emp.petTypes) {
            emp.petTypes.forEach(type => petTypesSet.add(type));
          }
        });
        return [...petTypesSet];
      },
    },
});