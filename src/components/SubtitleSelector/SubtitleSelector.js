import React, {useRef} from 'react';
import srt2vtt from './srt2vtt';
import './SubtitleSelector.css';

function SubtitleSelector(props) {
  const { onSubtitlePicked } = props
  const fileField = useRef(null)
  const onClick = () => {
    if (!fileField.current) {
      return
    }
    // reset value, so 'onChange' always works
    fileField.current.value = ''
    fileField.current.click()
  }

  const onFileAdded = (e) => {
    if (!e.target.files) {
      return
    }

    const file = e.target.files[0]
    if (!file.name.endsWith('.srt')) {
      // we'll assume it's vtt
      const objectURL = URL.createObjectURL(file);
      onSubtitlePicked(objectURL);
      return;
    }

    // .srt isn't support by browsers so we need to convert to vtt
    const reader = new FileReader();
    reader.onload = function(e) {
      const converted = srt2vtt(e.target.result);
      const objectURL = URL.createObjectURL(new Blob([converted], {type: 'text/vtt'}));
      onSubtitlePicked(objectURL);
    };

    reader.readAsText(file);
  }

  return (
    <>
      <button onClick={onClick} className="big-buttons">
        Add Subtitle file
      </button>
      <input
        type="file"
        ref={fileField}
        hidden={true}
        accept=".vtt,.srt"
        onChange={onFileAdded}
      />
    </>
  );
}

export default SubtitleSelector;
