const app = require('./app');
const { PORT, SPRING_BOOT_API_URL } = require('./config/config');

app.listen(PORT, () => {
  console.log(`API Árbitros corriendo en http://localhost:${PORT}`);
  console.log(`Proxying hacia Spring Boot en ${SPRING_BOOT_API_URL}`);
});
