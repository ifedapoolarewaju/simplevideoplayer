import React, { useRef, useState } from 'react';
import './VideoSelector.css';
import pressplay from '../../playicon.png';

function VideoSelector(props) {
    const { onVideoPicked } = props;
    const [dragActive, setDragActive] = useState(false);
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
        const videoName = file.name;
        const objectURL = URL.createObjectURL(file);
        onVideoPicked(objectURL, videoName);
    };

    const onDrag = (e) => {
        console.log('dragging');
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const onDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!e.dataTransfer.files || !e.dataTransfer.files[0]) {
            return;
        }

        const file = e.dataTransfer.files[0];
        const videoName = file.name;
        const objectURL = URL.createObjectURL(file);
        onVideoPicked(objectURL, videoName);
    };

    return (
        <div
            onDrop={onDrop}
            onDragEnter={onDrag}
            onDragOver={onDrag}
            onDragLeave={onDrag}
            className='VideoSelector'
        >
            <div
                style={{
                    border: 'pink 2px solid',
                    position: 'absolute',
                    inset: '-20%',
                    display: dragActive ? 'block' : 'none',
                }}
            />
            <h2>
                Why download a video player when you can simply play your videos
                with the browser?
            </h2>
            <h5>
                Your videos will not be uploaded anywhere, it's all happening on
                your computer.
            </h5>
            <button onClick={onClick} className='default-button'>
                <img src={pressplay} width='30px' alt='Press Play icon' />
                &nbsp;<span>Select a video file</span>
            </button>
            <input
                type='file'
                ref={fileField}
                hidden={true}
                accept='video/mp4,video/x-m4v,video/*,.mkv'
                onChange={onFileAdded}
            />
        </div>
    );
}

export default VideoSelector;
