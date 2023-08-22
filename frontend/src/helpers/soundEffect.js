import React, { useEffect } from 'react';

const SoundEffect = (props) => {
    console.log(props)
    //let audioElement = props.audioElement?.current || false;
    let audioElement
    let audioContext
    let source
    //source = audioContext.createMediaElementSource(audioElement);

    useEffect(() => {


        const createAudioSource = () => {

            audioElement = document.getElementById('previewSound');
            audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Pastikan elemen media tidak terhubung sebelumnya
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }

            // Putuskan koneksi terlebih dahulu jika sudah terhubung sebelumnya
            if (audioContext.state === 'running') {
                audioContext.suspend().then(() => {
                    audioContext.resume();
                    source = audioContext.createMediaElementSource(audioElement);
                });
            } else {
                source = audioContext.createMediaElementSource(audioElement);
            }
        }

        // Wah-Wah Effect
        const playWahWah = () => {
            createAudioSource();
            console.log('playWahWah');
            alert('playWahWah')
            const inputFilter = audioContext.createBiquadFilter();
            inputFilter.type = 'lowpass';
            const outputFilter = audioContext.createBiquadFilter();
            outputFilter.type = 'lowpass';

            const lfo = audioContext.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.value = 1; // Adjust LFO frequency

            const lfoGain = audioContext.createGain();
            lfoGain.gain.value = 100; // Adjust LFO gain

            source.connect(inputFilter);
            inputFilter.connect(lfoGain);
            lfo.connect(lfoGain);
            lfoGain.connect(outputFilter.frequency);
            outputFilter.connect(audioContext.destination);

            lfo.start();
            audioElement.play();
            //source.disconnect();
        }

        // Tremolo Effect
        const playTremolo = () => {
            createAudioSource();
            console.log('playTremolo');
            alert('playTremolo')
            const tremoloGain = audioContext.createGain();
            const lfo = audioContext.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.value = 5; // Adjust LFO frequency

            source.connect(tremoloGain);
            lfo.connect(tremoloGain.gain);
            tremoloGain.connect(audioContext.destination);

            lfo.start();
            audioElement.play();
            //source.disconnect();
        }

        // Pitch Shifting Effect
        const playPitchShifting = () => {
            createAudioSource();
            console.log('playPitchShifting');
            alert('playPitchShifting')
            const pitchShift = audioContext.createBufferSource();
            pitchShift.buffer = audioContext.createBuffer(1, audioElement.duration * audioContext.sampleRate, audioContext.sampleRate);
            pitchShift.playbackRate.value = 1.5; // Adjust pitch shift value

            source.connect(audioContext.destination);
            pitchShift.connect(audioContext.destination);

            pitchShift.start();
            audioElement.play();
            //source.disconnect();
        }

        // Ring Modulation Effect
        const playRingModulation = () => {
            createAudioSource();
            console.log('playRingModulation');
            alert('playRingModulation')
            const carrier = audioContext.createOscillator();
            carrier.type = 'sine';
            carrier.frequency.value = 440; // Adjust carrier frequency

            const gain = audioContext.createGain();
            gain.gain.value = 0.5;

            source.connect(gain);
            carrier.connect(gain.gain);
            gain.connect(audioContext.destination);

            carrier.start();
            audioElement.play();
            //source.disconnect();
        }


        // Echo Effect
        const playEcho = () => {
            createAudioSource();
            console.log('playEcho');
            alert('playEcho')
            const echoGain = audioContext.createGain();
            const delayNode = audioContext.createDelay();
            delayNode.delayTime.value = 0.5; // Adjust delay time

            source.connect(echoGain);
            source.connect(delayNode);
            delayNode.connect(echoGain);
            echoGain.connect(audioContext.destination);

            source.start();
            audioElement.play();
            //source.disconnect();
        }

        // Reverb Effect
        const playReverb = () => {
            createAudioSource();
            console.log('playReverb');
            alert('playReverb')
            const convolverNode = audioContext.createConvolver();
            fetch('reverb_impulse_response.wav') // Replace with your impulse response file URL
                .then(response => response.arrayBuffer())
                .then(buffer => audioContext.decodeAudioData(buffer))
                .then(impulseBuffer => {
                    convolverNode.buffer = impulseBuffer;
                    source.connect(convolverNode);
                    convolverNode.connect(audioContext.destination);
                    source.start();
                });

            audioElement.play();
            //source.disconnect();
        }

        // Distortion Effect
        const playDistortion = () => {
            createAudioSource();
            console.log('playDistortion');
            alert('playDistortion')
            const distortion = audioContext.createWaveShaper();
            distortion.curve = makeDistortionCurve(400); // Adjust distortion intensity

            source.connect(distortion);
            distortion.connect(audioContext.destination);

            source.start();
            audioElement.play();
            //source.disconnect();
        }
        /* 
        const makeDistortionCurve = (amount =>) {
            const samples = 44100;
            const curve = new Float32Array(samples);
            const deg = Math.PI / 180;
        
            for (let i = 0; i < samples; ++i) {
                const x = i * 2 / samples - 1;
                curve[i] = (3 + amount) * x * 20 * deg / (Math.PI + amount * Math.abs(x));
            }
        
            return curve;
        }
         */
        // Bitcrushing Effect
        const playBitcrushing = () => {
            createAudioSource();
            console.log('playBitcrushing');
            alert('playBitcrushing')
            const bitcrusher = audioContext.createScriptProcessor(4096, 1, 1);
            bitcrusher.onaudioprocess = (event) => {
                const inputBuffer = event.inputBuffer.getChannelData(0);
                const outputBuffer = event.outputBuffer.getChannelData(0);
                for (let i = 0; i < inputBuffer.length; i++) {
                    const step = Math.pow(2, 16 - 1); // 16-bit resolution
                    outputBuffer[i] = Math.floor(inputBuffer[i] * step) / step;
                }
            };

            source.connect(bitcrusher);
            bitcrusher.connect(audioContext.destination);

            source.start();
            audioElement.play();
            //source.disconnect();
        }

        const playSoundWithEchoBuffer = () => {
            createAudioSource();
            console.log('playSoundWithEchoBuffer');
            alert('playSoundWithEchoBuffer')
            //const source = audioContext.createBufferSource();
            //source.buffer = audioBuffer;

            // Create delay node for the echo effect
            const delayNode = audioContext.createDelay();
            delayNode.delayTime.value = 0.5; // Adjust delay time (in seconds)

            // Connect the nodes
            source.connect(delayNode);
            delayNode.connect(audioContext.destination);

            // Start playing
            source.start();
        }


        // Reverb Effect
        const playReverbBuffer = () => {
            createAudioSource();
            console.log('playReverbBuffer');
            alert('playReverbBuffer')
            //const source = audioContext.createBufferSource();
            //source.buffer = audioBuffer;

            // Create ConvolverNode for reverb effect
            const convolverNode = audioContext.createConvolver();
            fetch('reverb_impulse_response.wav') // Replace with your impulse response file URL
                .then(response => response.arrayBuffer())
                .then(buffer => audioContext.decodeAudioData(buffer))
                .then(impulseBuffer => {
                    convolverNode.buffer = impulseBuffer;
                    source.connect(convolverNode);
                    convolverNode.connect(audioContext.destination);
                    source.start();
                });
        }


        // Distortion Effect
        const playDistortionBuffer = () => {
            createAudioSource();
            console.log('playDistortionBuffer');
            alert('playDistortionBuffer')
            //const source = audioContext.createBufferSource();
            //source.buffer = audioBuffer;

            // Create WaveShaperNode for distortion effect
            const distortionNode = audioContext.createWaveShaper();
            distortionNode.curve = makeDistortionCurve(400); // Adjust distortion intensity
            source.connect(distortionNode);
            distortionNode.connect(audioContext.destination);
            source.start();
        }


        const makeDistortionCurve = (amount) => {
            const samples = 44100;
            const curve = new Float32Array(samples);
            const deg = Math.PI / 180;

            for (let i = 0; i < samples; ++i) {
                const x = i * 2 / samples - 1;
                curve[i] = (3 + amount) * x * 20 * deg / (Math.PI + amount * Math.abs(x));
            }

            return curve;
        }


        // Chorus Effect
        const playChorusBuffer = () => {
            createAudioSource();
            console.log('playChorusBuffer');
            alert('playChorusBuffer')
            //const source = audioContext.createBufferSource();
            //source.buffer = audioBuffer;

            // Create delay nodes for chorus effect
            const delayNode1 = audioContext.createDelay();
            delayNode1.delayTime.value = 0.03;

            const delayNode2 = audioContext.createDelay();
            delayNode2.delayTime.value = 0.07;

            source.connect(delayNode1);
            delayNode1.connect(delayNode2);
            delayNode2.connect(audioContext.destination);
            source.start();
        }



        // Panning Effect
        const playPanningBuffer = () => {
            createAudioSource();
            console.log('playPanningBuffer');
            alert('playPanningBuffer')
            //const source = audioContext.createBufferSource();
            //source.buffer = audioBuffer;

            // Create stereo panner node for panning effect
            const pannerNode = audioContext.createStereoPanner();
            pannerNode.pan.value = 0.5; // Adjust pan value (-1.0 to 1.0)
            source.connect(pannerNode);
            pannerNode.connect(audioContext.destination);
            source.start();
        }


        // Bitcrushing Effect
        const playBitcrushingBuffer = () => {
            createAudioSource();
            console.log('playBitcrushingBuffer');
            alert('playBitcrushingBuffer')
            //const source = audioContext.createBufferSource();
            //source.buffer = audioBuffer;

            // Create script processor node for bitcrushing effect
            const scriptNode = audioContext.createScriptProcessor(4096, 1, 1);
            scriptNode.onaudioprocess = (event) => {
                const inputBuffer = event.inputBuffer.getChannelData(0);
                const outputBuffer = event.outputBuffer.getChannelData(0);
                for (let i = 0; i < inputBuffer.length; i++) {
                    const step = Math.pow(2, 16 - 1); // 16-bit resolution
                    outputBuffer[i] = Math.floor(inputBuffer[i] * step) / step;
                }
            };

            source.connect(scriptNode);
            scriptNode.connect(audioContext.destination);
            source.start();
        }

        const playRingModulationBuffer = () => {
            createAudioSource();
            console.log('playRingModulationBuffer');
            alert('playRingModulationBuffer')
            //const source = audioContext.createBufferSource();
            //source.buffer = audioBuffer;

            const carrier = audioContext.createOscillator();
            carrier.type = 'sine';
            carrier.frequency.value = 440; // Adjust carrier frequency

            const gain = audioContext.createGain();
            gain.gain.value = 0.5;

            source.connect(gain);
            carrier.connect(gain.gain);
            gain.connect(audioContext.destination);

            carrier.start();
            source.start();
        }

        const playPitchShiftingBuffer = () => {
            createAudioSource();
            console.log('playPitchShiftingBuffer');
            alert('playPitchShiftingBuffer')
            //const source = audioContext.createBufferSource();
            //source.buffer = audioBuffer;

            const pitchShift = audioContext.createBufferSource();
            pitchShift.buffer = source.buffer;
            pitchShift.playbackRate.value = 1.5; // Adjust pitch shift value

            source.connect(audioContext.destination);
            pitchShift.connect(audioContext.destination);

            source.start();
            pitchShift.start();
        }

        const playTremoloBuffer = () => {
            createAudioSource();
            console.log('playTremoloBuffer');
            alert('playTremoloBuffer')
            //const source = audioContext.createBufferSource();
            //source.buffer = audioBuffer;

            const tremoloGain = audioContext.createGain();
            const lfo = audioContext.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.value = 5; // Adjust LFO frequency

            source.connect(tremoloGain);
            lfo.connect(tremoloGain.gain);
            tremoloGain.connect(audioContext.destination);

            lfo.start();
            source.start();
        }

        const playWahWahBuffer = () => {
            createAudioSource();
            console.log('playWahWahBuffer');
            alert('playWahWahBuffer')
            //const source = audioContext.createBufferSource();
            //source.buffer = audioBuffer;

            const inputFilter = audioContext.createBiquadFilter();
            inputFilter.type = 'lowpass';
            const outputFilter = audioContext.createBiquadFilter();
            outputFilter.type = 'lowpass';

            const lfo = audioContext.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.value = 1; // Adjust LFO frequency

            const lfoGain = audioContext.createGain();
            lfoGain.gain.value = 100; // Adjust LFO gain

            source.connect(inputFilter);
            inputFilter.connect(lfoGain);
            lfo.connect(lfoGain);
            lfoGain.connect(outputFilter.frequency);
            outputFilter.connect(audioContext.destination);

            lfo.start();
            source.start();
        }
        const btnplayWahWah = document.querySelector('.btn-playWahWah');
        const btnplayTremolo = document.querySelector('.btn-playTremolo');
        const btnplayPitchShifting = document.querySelector('.btn-playPitchShifting');
        const btnplayRingModulation = document.querySelector('.btn-playRingModulation');
        const btnplayEcho = document.querySelector('.btn-playEcho');
        const btnplayReverb = document.querySelector('.btn-playReverb');
        const btnplayDistortion = document.querySelector('.btn-playDistortion');
        const btnplayBitcrushing = document.querySelector('.btn-playBitcrushing');
        const btnplaySoundWithEchoBuffer = document.querySelector('.btn-playSoundWithEchoBuffer');
        const btnplayReverbBuffer = document.querySelector('.btn-playReverbBuffer');
        const btnplayDistortionBuffer = document.querySelector('.btn-playDistortionBuffer');
        const btnplayChorusBuffer = document.querySelector('.btn-playChorusBuffer');
        const btnplayPanningBuffer = document.querySelector('.btn-playPanningBuffer');
        const btnplayBitcrushingBuffer = document.querySelector('.btn-playBitcrushingBuffer');
        const btnplayRingModulationBuffer = document.querySelector('.btn-playRingModulationBuffer');
        const btnplayPitchShiftingBuffer = document.querySelector('.btn-playPitchShiftingBuffer');
        const btnplayTremoloBuffer = document.querySelector('.btn-playTremoloBuffer');
        const btnplayWahWahBuffer = document.querySelector('.btn-playWahWahBuffer');

        btnplayWahWah.addEventListener('click', playWahWah);
        btnplayTremolo.addEventListener('click', playTremolo);
        btnplayPitchShifting.addEventListener('click', playPitchShifting);
        btnplayRingModulation.addEventListener('click', playRingModulation);
        btnplayEcho.addEventListener('click', playEcho);
        btnplayReverb.addEventListener('click', playReverb);
        btnplayDistortion.addEventListener('click', playDistortion);
        btnplayBitcrushing.addEventListener('click', playBitcrushing);
        btnplaySoundWithEchoBuffer.addEventListener('click', playSoundWithEchoBuffer);
        btnplayReverbBuffer.addEventListener('click', playReverbBuffer);
        btnplayDistortionBuffer.addEventListener('click', playDistortionBuffer);
        btnplayChorusBuffer.addEventListener('click', playChorusBuffer);
        btnplayPanningBuffer.addEventListener('click', playPanningBuffer);
        btnplayBitcrushingBuffer.addEventListener('click', playBitcrushingBuffer);
        btnplayRingModulationBuffer.addEventListener('click', playRingModulationBuffer);
        btnplayPitchShiftingBuffer.addEventListener('click', playPitchShiftingBuffer);
        btnplayTremoloBuffer.addEventListener('click', playTremoloBuffer);
        btnplayWahWahBuffer.addEventListener('click', playWahWahBuffer);

        return () => {
            btnplayWahWah.removeEventListener('click', 'playWahWah')
            btnplayTremolo.removeEventListener('click', 'playTremolo')
            btnplayPitchShifting.removeEventListener('click', 'playPitchShifting')
            btnplayRingModulation.removeEventListener('click', 'playRingModulation')
            btnplayEcho.removeEventListener('click', 'playEcho')
            btnplayReverb.removeEventListener('click', 'playReverb')
            btnplayDistortion.removeEventListener('click', 'playDistortion')
            btnplayBitcrushing.removeEventListener('click', 'playBitcrushing')
            btnplaySoundWithEchoBuffer.removeEventListener('click', 'playSoundWithEchoBuffer')
            btnplayReverbBuffer.removeEventListener('click', 'playReverbBuffer')
            btnplayDistortionBuffer.removeEventListener('click', 'playDistortionBuffer')
            btnplayChorusBuffer.removeEventListener('click', 'playChorusBuffer')
            btnplayPanningBuffer.removeEventListener('click', 'playPanningBuffer')
            btnplayBitcrushingBuffer.removeEventListener('click', 'playBitcrushingBuffer')
            btnplayRingModulationBuffer.removeEventListener('click', 'playRingModulationBuffer')
            btnplayPitchShiftingBuffer.removeEventListener('click', 'playPitchShiftingBuffer')
            btnplayTremoloBuffer.removeEventListener('click', 'playTremoloBuffer')
            btnplayWahWahBuffer.removeEventListener('click', 'playWahWahBuffer')
        }
    })
    return (
        <>
            <div className="col-md-12">
                <button className="btn btn-primary btn-playWahWah" type="button">
                    Play Wah Wah
                </button>
                <button className="btn btn-primary btn-playTremolo" type="button">
                    Play Tremolo
                </button>
                <button className="btn btn-primary btn-playPitchShifting" type="button">
                    Play Pitch Shifting
                </button>
                <button className="btn btn-primary btn-playRingModulation" type="button">
                    Play Ring Modulation
                </button>
                <button className="btn btn-primary btn-playEcho" type="button">
                    Play Echo
                </button>
                <button className="btn btn-primary btn-playReverb" type="button">
                    Play Reverb
                </button>
                <button className="btn btn-primary btn-playDistortion" type="button">
                    Play Distortion
                </button>
                <button className="btn btn-primary btn-playBitcrushing" type="button">
                    Play Bitcrushing
                </button>
                <button className="btn btn-primary btn-playSoundWithEchoBuffer" type="button">
                    Play Sound With Echo Buffer
                </button>
                <button className="btn btn-primary btn-playReverbBuffer" type="button">
                    Play Reverb Buffer
                </button>
                <button className="btn btn-primary btn-playDistortionBuffer" type="button">
                    Play Distortion Buffer
                </button>
                <button className="btn btn-primary btn-playChorusBuffer" type="button">
                    Play Chorus Buffer
                </button>
                <button className="btn btn-primary btn-playPanningBuffer" type="button">
                    Play Panning Buffer
                </button>
                <button className="btn btn-primary btn-playBitcrushingBuffer" type="button">
                    Play Bitcrushing Buffer
                </button>
                <button className="btn btn-primary btn-playRingModulationBuffer" type="button">
                    Play Ring Modulation Buffer
                </button>
                <button className="btn btn-primary btn-playPitchShiftingBuffer" type="button">
                    Play Pitch Shifting Buffer
                </button>
                <button className="btn btn-primary btn-playTremoloBuffer" type="button">
                    Play Tremolo Buffer
                </button>
                <button className="btn btn-primary btn-playWahWahBuffer" type="button">
                    Play Wah Wah Buffer
                </button>
            </div>
        </>
    );
}

    ;

export default SoundEffect;