import axios from './axios';

export const uploadService = {
  // Upload single image
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 60 seconds timeout
    });
    return response.data;
  },

  // Upload multiple images
  uploadImages: async (files, onProgress) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await axios.post('/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 120000, // 120 seconds (2 minutes) for multiple images
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Upload Progress: ${percentCompleted}%`);
        if (onProgress) {
          onProgress(percentCompleted);
        }
      },
    });
    return response.data;
  },

  // Delete image
  deleteImage: async (publicId) => {
    const response = await axios.delete('/upload/image', {
      data: { publicId },
    });
    return response.data;
  },
};
