import React, { useRef } from 'react';
import './VideoSelector.css';
import pressplay from '../../playicon.png';

function VideoSelector(props) {
  const { onVideoPicked } = props;
  const fileField = useRef(null);
  const onClick = () => {
    if (!fileField.current) {
      return;
    }
    // reset value, so 'onChange' always works
    fileField.current.value = '';
    fileField.current.click();
  };

  const onFileAdded = (e) => {
    if (!e.target.files) {
      return;
    }

    const file = e.target.files[0];
    const objectURL = URL.createObjectURL(file);
    onVideoPicked(objectURL);
  };

  return (
    <div className='VideoSelector'>
      <h2>
        Why download a video player when you can simply play your videos with the
        browser?
      </h2>
      <h5>
        Your videos will not be uploaded anywhere, it's all happening on your
        computer.
      </h5>
      <button onClick={onClick} className='default-button'>
        <img src={pressplay} width='30px' alt='Press Play icon' />
        &nbsp;<span>Select a video file</span>
      </button>
      <input type="file" ref={fileField} hidden={true} accept="video/mp4,video/x-m4v,video/*,.mkv" onChange={onFileAdded}/>
    </div>
  );
}

export default VideoSelector;
