
import React, { useState, useCallback, useRef } from 'react';
import JSZip from 'jszip';
import { ImageStyle, GeneratedImage, AspectRatio, AppSettings } from './types';
import { generateImage } from './services/geminiService';
import useLocalStorage from './hooks/useLocalStorage';
import { useToast } from './hooks/useToast';
import Button from './components/Button';
import TrashIcon from './components/icons/TrashIcon';
import UploadIcon from './components/icons/UploadIcon';
import SettingsIcon from './components/icons/SettingsIcon';
import DownloadIcon from './components/icons/DownloadIcon';
import ImageGallery from './components/ImageGallery';
import Modal from './components/Modal';
import SettingsPanel from './components/SettingsPanel';
import Toast from './components/Toast';

const App: React.FC = () => {
  const [prompts, setPrompts] = useState<string>('');
  const [imageStyle, setImageStyle] = useState<ImageStyle>(ImageStyle.PIXEL);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [generatedImages, setGeneratedImages] = useLocalStorage<GeneratedImage[]>('generated-images', []);
  const [selectedImageIds, setSelectedImageIds] = useState<Set<string>>(new Set());
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<GeneratedImage | null>(null);
  const [settings, setSettings] = useLocalStorage<AppSettings>('app-settings', { apiKeys: [] });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast, showToast } = useToast();

  const handleGenerate = useCallback(async () => {
    if (settings.apiKeys.length === 0) {
      showToast('API key is missing. Please add one in Settings.', 'error');
      setIsSettingsOpen(true);
      return;
    }
  
    const promptsList = prompts.split('\n').map(p => p.trim()).filter(p => p);
    if (promptsList.length === 0) {
      showToast("Please enter at least one prompt.", 'error');
      return;
    }

    setIsGenerating(true);

    for (let i = 0; i < promptsList.length; i++) {
      const prompt = promptsList[i];
      const apiKey = settings.apiKeys[i % settings.apiKeys.length];
      
      setLoadingMessage(`(${i + 1}/${promptsList.length}) ${prompt.slice(0, 20)}...`);

      try {
        const base64Image = await generateImage(prompt, imageStyle, aspectRatio, apiKey);
        const imageUrl = `data:image/jpeg;base64,${base64Image}`;
        
        setGeneratedImages(prev => [
          ...prev, 
          { id: `${Date.now()}-${i}`, url: imageUrl, prompt: prompt }
        ]);
      } catch (error) {
        console.error(`Error for prompt "${prompt}":`, error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        showToast(`Failed on prompt: "${prompt}". Error: ${errorMessage}`, 'error');
        
        if (errorMessage.includes("Invalid API Key") || errorMessage.includes("Billing Required")) {
            setIsSettingsOpen(true);
            setIsGenerating(false);
            setLoadingMessage('');
            return;
        }
      }

      // Delay between calls to respect API rate limits
      if (i < promptsList.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    setIsGenerating(false);
    setLoadingMessage('');
  }, [prompts, imageStyle, aspectRatio, settings.apiKeys, setGeneratedImages, showToast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setPrompts(prev => prev ? `${prev}\n${text}` : text);
      };
      reader.readAsText(file);
    }
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };
  
  const handleSaveSettings = (apiKeys: string[]) => {
    setSettings({ apiKeys });
    setIsSettingsOpen(false);
    showToast("Settings saved successfully!", "success");
    if(apiKeys.length > 0 && prompts && !isGenerating) {
        handleGenerate();
    }
  };

  const handleToggleSelectImage = (id: string) => {
    setSelectedImageIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleDeleteImage = (idToDelete: string) => {
    setGeneratedImages(prev => prev.filter(img => img.id !== idToDelete));
    setSelectedImageIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(idToDelete);
      return newSet;
    });
    showToast("Image deleted.", "info");
  };
  
  const handleSelectAll = () => {
    if (generatedImages.length > 0 && selectedImageIds.size === generatedImages.length) {
      setSelectedImageIds(new Set()); // Deselect all
    } else {
      const allImageIds = new Set(generatedImages.map(img => img.id));
      setSelectedImageIds(allImageIds); // Select all
    }
  };

  const handleClearAll = () => {
    if(generatedImages.length === 0) return;

    if (window.confirm(`Are you sure you want to delete all ${generatedImages.length} images? This cannot be undone.`)) {
      setGeneratedImages([]);
      setSelectedImageIds(new Set());
      showToast("Gallery cleared.", "success");
    }
  };

  const handleDownloadSelected = async () => {
    if (selectedImageIds.size === 0) return;
    showToast(`Downloading ${selectedImageIds.size} images...`, 'info');

    const zip = new JSZip();
    const selectedImages = generatedImages.filter(img => selectedImageIds.has(img.id));

    for (const image of selectedImages) {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const fileName = `${image.prompt.replace(/\s+/g, '_').slice(0, 30)}.jpeg`;
      zip.file(fileName, blob);
    }

    zip.generateAsync({ type: 'blob' }).then(content => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'pixel-art-pack.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const areAllSelected = generatedImages.length > 0 && selectedImageIds.size === generatedImages.length;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8 font-press-start">
      
      <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} />
      
      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="API Key Settings">
        <SettingsPanel onSave={handleSaveSettings} initialApiKeys={settings.apiKeys} />
      </Modal>

      <Modal isOpen={!!previewImage} onClose={() => setPreviewImage(null)} title="Image Preview">
        {previewImage && (
          <div className="flex flex-col items-center gap-4">
            <img src={previewImage.url} alt={previewImage.prompt} className="max-w-full max-h-[85vh] object-contain pixelated" />
            <p className="text-center text-gray-300 text-sm">{previewImage.prompt}</p>
          </div>
        )}
      </Modal>

      <header className="flex justify-between items-center mb-6 pb-4 border-b-4 border-gray-700">
        <h1 className="text-xl sm:text-2xl md:text-3xl text-cyan-400 uppercase tracking-wider">
          AI Image Gen
        </h1>
        <Button onClick={() => setIsSettingsOpen(true)} variant="secondary" className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5"/>
            <span className="hidden sm:inline">Settings</span>
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Control Panel */}
        <div className="lg:col-span-1 bg-gray-800 p-6 border-4 border-black shadow-[8px_8px_0_0_#000] flex flex-col gap-6 self-start">
          <div>
            <label htmlFor="prompts" className="block mb-2 text-lg text-gray-300">Prompts</label>
            <textarea
              id="prompts"
              value={prompts}
              onChange={(e) => setPrompts(e.target.value)}
              className="w-full h-48 p-3 bg-gray-900 border-2 border-gray-600 focus:border-cyan-400 focus:outline-none resize-y selection:bg-cyan-400 selection:text-black"
              placeholder="A heroic knight riding a giant snail&#x0a;A robot DJ at a forest party&#x0a;...one prompt per line"
              disabled={isGenerating}
            />
             <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".txt,.csv"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="secondary"
              className="w-full mt-2 flex items-center justify-center gap-2"
              disabled={isGenerating}
            >
              <UploadIcon className="w-5 h-5"/>
              Upload Prompts
            </Button>
          </div>

          <div>
            <label className="block mb-2 text-lg text-gray-300">Style</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setImageStyle(ImageStyle.PIXEL)}
                disabled={isGenerating}
                className={`p-4 border-2 ${imageStyle === ImageStyle.PIXEL ? 'border-cyan-400 bg-cyan-900' : 'border-gray-600 bg-gray-700'} hover:border-cyan-400 transition-colors disabled:opacity-50`}
              >
                Pixel Art
              </button>
              <button
                onClick={() => setImageStyle(ImageStyle.STICK_FIGURE)}
                disabled={isGenerating}
                className={`p-4 border-2 ${imageStyle === ImageStyle.STICK_FIGURE ? 'border-cyan-400 bg-cyan-900' : 'border-gray-600 bg-gray-700'} hover:border-cyan-400 transition-colors disabled:opacity-50`}
              >
                Stick Figure
              </button>
            </div>
          </div>
          
          <div>
            <label className="block mb-2 text-lg text-gray-300">Aspect Ratio</label>
            <div className="grid grid-cols-3 gap-2">
                {(["1:1", "16:9", "9:16", "4:3", "3:4"] as const).map((ratio) => (
                    <button
                        key={ratio}
                        onClick={() => setAspectRatio(ratio)}
                        disabled={isGenerating}
                        className={`p-3 text-sm border-2 ${aspectRatio === ratio ? 'border-cyan-400 bg-cyan-900' : 'border-gray-600 bg-gray-700'} hover:border-cyan-400 transition-colors disabled:opacity-50`}
                    >
                        {ratio}
                    </button>
                ))}
            </div>
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={!prompts || isGenerating} 
            isLoading={isGenerating}
            className="w-full text-lg py-3"
          >
            {isGenerating ? loadingMessage : 'Generate!'}
          </Button>
        </div>

        {/* Image Gallery */}
        <div className="lg:col-span-2 bg-gray-800 p-6 border-4 border-black shadow-[8px_8px_0_0_#000]">
          <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
            <h2 className="text-xl text-gray-300">Gallery ({generatedImages.length})</h2>
            <div className="flex gap-2 flex-wrap justify-end">
              <Button
                onClick={handleDownloadSelected}
                variant="secondary"
                disabled={isGenerating || selectedImageIds.size === 0}
              >
                <DownloadIcon className="w-5 h-5" />
                Download ({selectedImageIds.size})
              </Button>
              <Button
                onClick={handleSelectAll}
                variant="secondary"
                disabled={isGenerating || generatedImages.length === 0}
              >
                {areAllSelected ? 'Deselect All' : 'Select All'}
              </Button>
              <Button
                onClick={handleClearAll}
                variant="danger"
                disabled={isGenerating || generatedImages.length === 0}
              >
                <TrashIcon className="w-5 h-5" />
                Clear All
              </Button>
            </div>
          </div>
          <div className="h-[60vh] overflow-y-auto pr-2">
             <ImageGallery 
                images={generatedImages} 
                selectedImageIds={selectedImageIds}
                onSelectImage={handleToggleSelectImage}
                onPreviewImage={setPreviewImage}
                onDeleteImage={handleDeleteImage}
              />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
