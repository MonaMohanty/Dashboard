import React, { useState } from 'react';
import { FiUpload } from 'react-icons/fi'; // Upload Icon
import { FaFile, FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaFileVideo, FaFileAudio, FaFileCode } from 'react-icons/fa';

import { toast } from 'react-toastify';
import axios from 'axios';
import Loader from '../utils/Loader';

const ImageDetection = () => {
  const [image, setImage] = useState(null); // State to store the uploaded image
  const [file, setFile] = useState(null); // State to store the actual file to upload
  const [annotatedImage, setAnnotatedImage] = useState(null);

  // const [video, setVideo] = useState(null); // State to store the uploaded video
  // const [videoFile, setVideoFile] = useState(null); // State to store the actual video file to upload
  // const [annotatedVideo, setAnnotatedVideo] = useState(null);

  const [loadingImage, setLoadingImage] = useState(false);
  // const [loadingVideo, setLoadingVideo] = useState(false);

  // Handle image file upload
  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const imageURL = URL.createObjectURL(selectedFile); // Create a temporary URL for the image
      setImage(imageURL);
      setFile(selectedFile); // Store the actual file for uploading
      toast.success("File selected successfully!");
    }
  };

  // Handle video file upload
  // const handleVideoSelect = (event) => {
  //   const selectedFile = event.target.files[0];
  //   if (selectedFile) {
  //     const videoURL = URL.createObjectURL(selectedFile); // Create a temporary URL for the video
  //     setVideo(videoURL);
  //     setVideoFile(selectedFile); // Store the actual video file for uploading
  //     toast.success("Video selected successfully!");
  //     console.log(videoURL);
  //   }
  // };

  // Handle object detection for images
  const handleObjectDetection = async () => {
    if (!file) {
      toast.error("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      setLoadingImage(true);
      const response = await axios.post('http://localhost:5000/detect-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('this is response', response.data);

      const base64Image = response.data.imageBase64;
      setAnnotatedImage(base64Image);

      toast.success("Object detection completed!");
      setLoadingImage(false);
    } catch (error) {
      console.error('Error in object detection:', error.response ? error.response.data : error.message);
      toast.error("Object detection failed!");
      setLoadingImage(false);
    }
  };

  // Handle object detection for videos

  // const handleVideoDetection = async () => {
  //   if (!videoFile) {
  //     toast.error('Please select a video file first!');
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append('video', videoFile);

  //   try {
  //     setLoadingVideo(true);
  //     const response = await axios.post('http://localhost:5000/detect-video', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //       responseType: 'blob', // Ensure the response is treated as a binary stream
  //     });

  //     const videoBlob = new Blob([response.data], { type: 'video/mp4' });

  //     // Create a URL from the Blob for the download link
  //     const videoUrl = URL.createObjectURL(videoBlob);

  //     // // Create an anchor element for downloading
  //     // const downloadLink = document.createElement('a');
  //     // downloadLink.href = videoUrl;
  //     // downloadLink.download = 'annotated_video.mp4'; // Set the desired file name
  //     // downloadLink.click(); // Trigger the download

  //     setAnnotatedVideo(videoUrl);
  //     toast.success('Video detection completed!');
  //   } catch (error) {
  //     console.error('Error uploading video:', error);
  //     toast.error('Video upload failed!');
  //   } finally {
  //     setLoadingVideo(false);
  //   }
  // };


  // console.log(annotatedVideo)

  return (
    <div className="flex flex-col h-screen overflow-auto  w-[89%] absolute right-0 z-10 ">



      {/* Image Section */}
      <div className="text-center ">


        <h1 className="mt-10 text-xl sm:text-2xl xl:text-4xl font-semibold text-center  ">
          YOLO V8 for seamless image detection...
        </h1>



        <div className="mb-6 flex  items-center  gap-44 flex-wrap ">
          <div className=''>
            {/* 1st row */}
            <div className='flex '>
              <div className='mt-6 mx-4'>
                {/* <h3 className="mb-4 font-semibold">Sample Image 1:</h3> */}
                <div className='w-56 h-56 overflow-hidden  rounded-lg'>
                  <img
                    src="/sample_files/sample_image_3.jpg"
                    alt="Uploaded Preview"
                    className="w-full h-full object-contain rounded-lg border border-gray-700"
                  />
                </div>
              </div>
              <div className='mt-6 mx-4'>
                {/* <h3 className="mb-4 font-semibold">Sample Output 1:</h3> */}
                <div className='w-56 h-56 overflow-hidden  rounded-lg'>
                  <img
                    src="/sample_files/clock_output.jpeg"
                    alt="Uploaded Preview"
                    className="w-full h-full object-contain rounded-lg border border-gray-700"
                  />
                </div>
              </div>
              <div className='mt-6 mx-4'>
                {/* <h3 className="mb-4 font-semibold">Sample Image 2:</h3> */}
                <div className='w-56 h-56 overflow-hidden  rounded-lg'>
                  <img
                    src="/sample_files/sample_image_4.jpg"
                    alt="Uploaded Preview"
                    className="w-full h-full object-contain rounded-lg border border-gray-700"
                  />
                </div>
              </div>
            </div>
            {/* 2nd row */}

            <div className='flex'>
              <div className='mt-6 mx-4'>
                {/* <h3 className="mb-4 font-semibold">Sample Output 2:</h3> */}
                <div className='w-56 h-56 overflow-hidden  rounded-lg'>
                  <img
                    src="/sample_files/animals_output.jpeg"
                    alt="Uploaded Preview"
                    className="w-full h-full object-contain rounded-lg border border-gray-700"
                  />
                </div>
              </div>
              <div className='mt-6 mx-4'>
                {/* <h3 className="mb-4 font-semibold">Sample Output 2:</h3> */}
                <div className='w-56 h-56 overflow-hidden  rounded-lg'>
                  <img
                    src="/sample_files/sample_image_5.jpg"
                    alt="Uploaded Preview"
                    className="w-full h-full object-contain rounded-lg border border-gray-700"
                  />
                </div>
              </div>
              <div className='mt-6 mx-4'>
                {/* <h3 className="mb-4 font-semibold">Sample Output 2:</h3> */}
                <div className='w-56 h-56 overflow-hidden  rounded-lg'>
                  <img
                    src="/sample_files/sample_image_6.jpg"
                    alt="Uploaded Preview"
                    className="w-full h-full object-contain rounded-lg border border-gray-700"
                  />
                </div>

              </div>
            </div>

          </div>


          <div className=''>
            <div className='flex flex-col  items-center justify-center w-fit mx-auto mb-4'>
              {image ? (
                <div className='mt-6'>
                  {/* <h3 className="mb-4 font-semibold">Uploaded Image:</h3> */}
                  <div className='w-56 h-56 overflow-hidden mx-4 '>
                    <img
                      src={image}
                      alt="Uploaded Preview"
                      className="w-full h-full object-contain rounded-lg border border-gray-700"
                    />
                  </div>
                </div>
              ) : (<FaFileImage className='w-52 h-52 mt-6 mx-4 text-gray-400 ' />)}

              {!loadingImage && annotatedImage && (
                <div className="mt-6">
                  {/* <h3 className="mb-4 font-semibold">Annotated Image:</h3> */}
                  <div className="w-56 h-56 overflow-hidden mx-4">
                    <img
                      src={annotatedImage}
                      alt="Annotated Preview"
                      className="object-contain  w-full h-full border border-gray-700 rounded-lg"
                    />
                  </div>
                </div>
              )}

              <div className='flex space-x-3 mt-3 items-center justify-center'>
                <label className="relative bg-blue-600 text-white font-medium px-6 py-3 rounded cursor-pointer hover:bg-blue-700">
                  Upload Image
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                </label>

                {image && (
                  <button
                    onClick={handleObjectDetection}
                    className=" bg-green-600 text-white font-medium px-6 py-3 rounded cursor-pointer hover:bg-green-700"
                  >
                    Detect Objects
                  </button>
                )}
              </div>

              {loadingImage && <div className='mt-10'><Loader /></div>}
            </div>
          </div>
        </div>




      </div>


    </div>
  );
};

export default ImageDetection;
