import app from './app';
import init from './scripts/init';
const PORT = process.env.PORT || 3000;
const startServer = async () => {
  try {
    const failed = await init();
    
    if (failed) {
      console.log(failed);
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};
startServer();