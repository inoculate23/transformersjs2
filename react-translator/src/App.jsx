import { useEffect, useRef, useState } from 'react'
import LanguageSelector from './components/LanguageSelector';
import Progress from './components/Progress';

import './App.css'
function App() {

  // Model loading
  const [ready, setReady] = useState(null);
  const [disabled, setDisabled] = useState(false);
  var [progressItems, setProgressItems] = useState([]);

  // Inputs and outputs
  const [input, setInput] = useState('I love walking my dog.');
  const [sourceLanguage, setSourceLanguage] = useState('eng_Latn');
  const [targetLanguage, setTargetLanguage] = useState('fra_Latn');
  const [selectedSpeaker, setSelectedSpeaker] = useState(DEFAULT_SPEAKER);

  const [output, setOutput] = useState('');

  // Create a reference to the worker object.
  const worker = useRef(null);

  // We use the `useEffect` hook to setup the worker as soon as the `App` component is mounted.
  useEffect(() => {
    if (!worker.current) {
      // Create the worker if it does not yet exist.
      worker.current = new Worker(new URL('./worker.js', import.meta.url), {
        type: 'module'
      });
    }

    // Create a callback function for messages from the worker thread.
    const onMessageReceived = (e) => {
      switch (e.data.status) {
        case 'initiate':
          // Model file start load: add a new progress item to the list.
          setReady(false);
          setProgressItems(prev => [...prev, e.data]);
          break;

        case 'progress':
          // Model file progress: update one of the progress items.
          setProgressItems(
            prev => prev.map(item => {
              if (item.file === e.data.file) {
                return { ...item, progress: e.data.progress }
              }
              return item;
            })
          );
          break;

        case 'done':
          // Model file loaded: remove the progress item from the list.
          setProgressItems(
            prev => prev.filter(item => item.file !== e.data.file)
          );
          break;

        case 'ready':
          // Pipeline ready: the worker is ready to accept messages.
          setReady(true);
          break;

        case 'update':
          // Generation update: update the output text.
          setOutput(e.data.output);
          break;

        case 'complete':
          // Generation complete: re-enable the "Translate" button
          setDisabled(false);
          break;
          
           const blobUrl = URL.createObjectURL(e.data.output);
          setOutput(blobUrl);
          break;
      }
    };

    // Attach the callback function as an event listener.
    worker.current.addEventListener('message', onMessageReceived);

    // Define a cleanup function for when the component is unmounted.
    return () => worker.current.removeEventListener('message', onMessageReceived);
  });

     // Define a cleanup function for when the component is unmounted.
    return () => worker.current.removeEventListener('message', onMessageReceived);
  };




  const translate = () => {
    setDisabled(true);
    worker.current.postMessage({
      text: input,
      src_lang: sourceLanguage,
      tgt_lang: targetLanguage,
    });
  }

  return (

      <div className='container'>
        <div className='language-container'>
          <LanguageSelector type={"Source"} defaultLanguage={"eng_Latn"} onChange={x => setSourceLanguage(x.target.value)} />
          <LanguageSelector type={"Target"} defaultLanguage={"es_Latn"} onChange={x => setTargetLanguage(x.target.value)} />
        </div>

        <div className='textbox-container'>
          <textarea value={input} rows={3} onChange={e => setInput(e.target.value)}></textarea>

          
          <textarea value={output} rows={3} readOnly></textarea>
        </div>
    


      <button disabled={disabled} onClick={translate}>Translate</button>

      <div className='progress-bars-container'>
        {ready === false && (
          <label>Loading models... (only run once)</label>
        )}
        {progressItems.map(data => (
          <div key={data.file}>
            <Progress text={data.file} percentage={data.progress} />
          </div>
        ))}
      </div>

      const isLoading = ready === false;
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='absolute gap-1 z-50 top-0 left-0 w-full h-full transition-all px-8 flex flex-col justify-center text-center' style={{
        opacity: isLoading ? 1 : 0,
        pointerEvents: isLoading ? 'all' : 'none',
        background: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(8px)',
      }}>
        {isLoading && (
          <label className='text-white text-xl p-3'>Loading models... (only run once)</label>
        )}
        {progressItems.map(data => (
          <div key={`${data.name}/${data.file}`}>
            <Progress text={`${data.name}/${data.file}`} percentage={data.progress} />
          </div>
        ))}
      </div>
      <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-xl m-2'>
        <h1 className='text-3xl font-semibold text-gray-800 mb-1 text-center'>In-browser Text to Speech</h1>
        <h2 className='text-base font-medium text-gray-700 mb-2 text-center'>Made with <a href='https://huggingface.co/docs/transformers.js'>🤗 Transformers.js</a></h2>
        <div className='mb-4'>
          <label htmlFor='text' className='block text-sm font-medium text-gray-600'>
            Text
          </label>
          <textarea
            id='text'
            className='border border-gray-300 rounded-md p-2 w-full'
            rows='4'
            placeholder='Enter text here'
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
        </div>
       
        </div>
      
    
};

    </>
  )


export default App
