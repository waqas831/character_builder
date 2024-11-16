const DownloadButton = ({ canvasRef }) => {
    const handleDownload = () => {
      const canvas = canvasRef.current;
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = 'meme-master.png';
      link.click();
    };
  
    return (
      <button
        onClick={handleDownload}
        className="px-4 py-2 bg-blue-500 text-white rounded-md mt-4"
      >
        Download Image
      </button>
    );
  };
  
  export default DownloadButton;
  