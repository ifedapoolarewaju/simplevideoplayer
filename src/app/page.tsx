import logo from '@/assets/logo.png';
import './App.css';
import VideoSelector from '@/components/VideoSelector/VideoSelector';
import Fork from '@/components/Fork/Fork';

export default function Home() {
    return (
        <div className='App'>
            <header className='App-header'>
                <div className='App-logo flex content-center items-center '>
                    <div className='App-icon'>
                        <img src={logo.src} width='15px' alt='logo' />
                    </div>
                    <span className='App-name'>Simple Video Player</span>
                </div>
                <Fork />
            </header>
            <div className='App-body'>
                <div className='App-information'>
                    <h2>
                        Why download a video player when you can simply play
                        your videos with the browser?
                    </h2>
                    <h5>
                        Your videos will not be uploaded anywhere, it is all
                        happening on your computer.
                    </h5>
                </div>
                <VideoSelector />
                <div className='App-Feature-Notes'>
                    <div>
                        <p>
                            <b>FEATURES</b>
                        </p>
                        <p>1. You can add subtitle files (SRT or WebVTT).</p>
                        <p>2. Easy to use keyboard controls</p>
                        <p>3. Increase volume to 400% (like you do in VLC)</p>
                    </div>

                    <div>
                        <p>
                            <b>WHY WAS THIS BUILT?</b>
                        </p>
                        <p>
                            1.{' '}
                            <a
                                href='https://github.com/ifedapoolarewaju/simplevideoplayer#why-did-i-build-this'
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                An abridged version of why Simple Video Player
                                was built.
                            </a>
                        </p>
                        <p>
                            2.{' '}
                            <a
                                href='https://ifedapo.com/posts/play-in-the-chrome-sandbox'
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                A more detailed version of why Simple Video
                                Player was built.
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
