const axios = require('axios');
const { SPRING_BOOT_API_URL } = require('../config/config');

const apiClient = axios.create({
  baseURL: `${SPRING_BOOT_API_URL}/api/arbitros`,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

module.exports = apiClient;
