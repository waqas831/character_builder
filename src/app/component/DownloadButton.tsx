const DownloadButton = ({ canvasRef }:any) => {
    const handleDownload = () => {
      const canvas:any = canvasRef.current;
      const image :any= canvas.toDataURL('image/png');
      const link :any= document.createElement('a');
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
  