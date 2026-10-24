import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  X,
  Loader2,
  Sparkles,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Image as ImageIcon,
  RefreshCw,
  Edit3,
  Check,
  Compass,
} from 'lucide-react';
import { addReport, generateId } from '../store';
import { useToast } from '../components/Toast';
import type { Category, Severity, AnalysisResult } from '../types';

const categories: Category[] = ['Pothole', 'Road Crack', 'Surface Damage', 'Waterlogging', 'Other'];
const severities: Severity[] = ['Low', 'Medium', 'High', 'Critical'];

// Curated example images for fast testing
const exampleImages = [
  {
    label: 'Deep Pothole',
    url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=700&q=80',
    category: 'Pothole' as Category,
    severity: 'Critical' as Severity,
    location: 'Hazratganj Road, Lucknow',
    lat: '26.8467',
    lng: '80.9462',
    description: 'Deep circular pothole approximately 2 feet wide near the intersection.',
    confidence: 87.4,
    recommendedAction: 'Schedule repair within 7 days due to high traffic and safety risk.',
  },
  {
    label: 'Road Crack',
    url: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?auto=format&fit=crop&w=700&q=80',
    category: 'Road Crack' as Category,
    severity: 'High' as Severity,
    location: 'Gomti Nagar Main Road, Lucknow',
    lat: '26.8563',
    lng: '80.9779',
    description: 'Longitudinal fracture along the center road seam extending ~15 meters.',
    confidence: 89.2,
    recommendedAction: 'Seal crack with bituminous compound before rainy season.',
  },
  {
    label: 'Surface Erosion',
    url: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=700&q=80',
    category: 'Surface Damage' as Category,
    severity: 'Medium' as Severity,
    location: 'Charbagh Station Circle, Lucknow',
    lat: '26.8393',
    lng: '80.9231',
    description: 'Asphalt peeling and exposed aggregate visible across lane.',
    confidence: 91.5,
    recommendedAction: 'Schedule asphalt milling and repaving within 14 days.',
  },
  {
    label: 'Waterlogging',
    url: 'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=700&q=80',
    category: 'Waterlogging' as Category,
    severity: 'Medium' as Severity,
    location: 'Indira Nagar Underpass, Lucknow',
    lat: '26.8729',
    lng: '80.9908',
    description: 'Stagnant rainwater accumulation 20-30cm due to clogged storm sewer.',
    confidence: 94.0,
    recommendedAction: 'Deploy municipal drainage pump and clear debris from culvert.',
  },
  {
    label: 'Surface Wear',
    url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=700&q=80',
    category: 'Surface Damage' as Category,
    severity: 'Low' as Severity,
    location: 'Mahanagar Sector B, Lucknow',
    lat: '26.8700',
    lng: '80.9500',
    description: 'Faded road markings and mild topcoat abrasion.',
    confidence: 79.5,
    recommendedAction: 'Repaint road thermo-strips and conduct quarterly review.',
  },
];

export default function ReportDamage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageUrl, setImageUrl] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [severity, setSeverity] = useState<Severity | ''>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reportId, setReportId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Stepper state calculation
  const currentStep = !imageUrl
    ? 1
    : !analysisResult
    ? 2
    : !category || !severity
    ? 3
    : !location
    ? 4
    : 5;

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file (JPG, PNG, WebP)', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageUrl(e.target?.result as string);
      setAnalysisResult(null);
    };
    reader.readAsDataURL(file);
  }, [showToast]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
    },
    [handleFile]
  );

  const selectExample = (ex: typeof exampleImages[0]) => {
    setImageUrl(ex.url);
    setDescription(ex.description);
    setLocation(ex.location);
    setLatitude(ex.lat);
    setLongitude(ex.lng);
    setCategory(ex.category);
    setSeverity(ex.severity);
    setAnalysisResult({
      category: ex.category,
      severity: ex.severity,
      confidence: ex.confidence,
      recommendedAction: ex.recommendedAction,
    });
    setErrors({});
    showToast(`Loaded example: ${ex.label}`, 'info');
  };

  const removeImage = () => {
    setImageUrl('');
    setAnalysisResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const runAnalysis = async () => {
    if (!imageUrl) {
      showToast('Please upload an image or select an example first', 'warning');
      return;
    }
    setAnalyzing(true);
    await new Promise((r) => setTimeout(r, 1200));

    // Simulated detection based on category or default
    const detectedCat: Category = category || 'Pothole';
    const detectedSev: Severity = severity || 'High';
    const conf = Math.round((85 + Math.random() * 12) * 10) / 10;
    const actions: Record<Category, string> = {
      Pothole: 'Schedule repair within 7 days due to safety risk.',
      'Road Crack': 'Seal crack with bitumen compound before weather wear.',
      'Surface Damage': 'Schedule resurfacing. Mark area with warning signs.',
      Waterlogging: 'Clear blocked municipal storm sewer.',
      Other: 'Dispatch visual road inspector for assessment.',
    };

    const result: AnalysisResult = {
      category: detectedCat,
      severity: detectedSev,
      confidence: conf,
      recommendedAction: actions[detectedCat],
    };

    setAnalysisResult(result);
    setCategory(detectedCat);
    setSeverity(detectedSev);
    setAnalyzing(false);
    showToast('AI analysis simulated successfully', 'success');
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude.toFixed(4));
          setLongitude(pos.coords.longitude.toFixed(4));
          if (!location) setLocation('Current GPS Location, Lucknow');
          showToast('GPS coordinates acquired', 'success');
        },
        () => {
          // Fallback Lucknow coords
          setLatitude('26.8467');
          setLongitude('80.9462');
          if (!location) setLocation('Hazratganj Road, Lucknow');
          showToast('Set default Lucknow coordinates', 'info');
        }
      );
    } else {
      setLatitude('26.8467');
      setLongitude('80.9462');
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!description.trim()) errs.description = 'Description is required';
    if (!location.trim()) errs.location = 'Location is required';
    if (!category) errs.category = 'Category is required';
    if (!severity) errs.severity = 'Severity is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));

    const id = generateId();
    addReport({
      id,
      title: description.length > 60 ? description.substring(0, 60) + '...' : description,
      description,
      category: category as Category,
      severity: severity as Severity,
      status: 'Submitted',
      location,
      latitude: latitude ? Number(latitude) : undefined,
      longitude: longitude ? Number(longitude) : undefined,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      confidence: analysisResult?.confidence,
      recommendedAction: analysisResult?.recommendedAction,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDemo: false,
    });

    setReportId(id);
    setSubmitting(false);
    setSubmitted(true);
    showToast(`Report ${id} successfully submitted!`, 'success');
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center animate-fade-in bg-white rounded-3xl p-8 border border-[#E2E6DC] shadow-sm">
        <div className="w-16 h-16 rounded-full bg-[#E8F5E9] border border-[#C8E6C9] flex items-center justify-center mx-auto mb-4 text-[#2E7D32]">
          <CheckCircle2 size={36} />
        </div>
        <h2 className="text-2xl font-bold text-[#15221B] mb-2">Report Successfully Submitted!</h2>
        <p className="text-sm text-[#5C6E63] mb-6">
          Your road issue report has been registered in the municipal database with tracking ID{' '}
          <span className="font-mono font-bold text-[#0E382B] bg-[#E8F4D9] px-2.5 py-1 rounded-md">
            {reportId}
          </span>
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate('/my-reports')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#0E382B] text-white text-xs font-semibold hover:bg-[#154E3A] transition-colors shadow-xs"
          >
            View in My Reports
          </button>
          <button
            onClick={() => {
              setSubmitted(false);
              setDescription('');
              setLocation('');
              setLatitude('');
              setLongitude('');
              setCategory('');
              setSeverity('');
              setImageUrl('');
              setAnalysisResult(null);
              setErrors({});
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#F4F5EE] border border-[#E2E6DC] text-[#15221B] text-xs font-semibold hover:bg-[#EAECE3] transition-colors"
          >
            Submit Another Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header with Title and Stepper */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A8B80]">
            Field Reporting
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#15221B]">
            Report a road issue.
          </h1>
          <p className="text-sm text-[#5C6E63] mt-0.5">
            Help identify damaged roads and bring attention to the places that need repair.
          </p>
        </div>

        {/* Stepper on right */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-white px-4 py-2 rounded-full border border-[#E2E6DC] shadow-2xs">
          {[
            { num: 1, label: 'Photograph' },
            { num: 2, label: 'AI Identify' },
            { num: 3, label: 'Severity' },
            { num: 4, label: 'Geotag' },
            { num: 5, label: 'Submit' },
          ].map((s, idx) => (
            <div key={s.num} className="flex items-center gap-1.5">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                  currentStep >= s.num
                    ? 'bg-[#0E382B] text-white'
                    : 'bg-[#F2F3EC] text-[#8A9A90]'
                }`}
              >
                {currentStep > s.num ? <Check size={10} /> : s.num}
              </span>
              <span
                className={`text-[11px] hidden sm:inline ${
                  currentStep >= s.num ? 'font-semibold text-[#15221B]' : 'text-[#8A9A90]'
                }`}
              >
                {s.label}
              </span>
              {idx < 4 && <span className="text-[#CCD5C7] text-xs hidden sm:inline">›</span>}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Balanced Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Column 1 (Left 6-cols): Upload Evidence */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-5 sm:p-6 border border-[#E2E6DC] shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#15221B] mb-3">1. Upload Evidence</h2>

              {!imageUrl ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 min-h-[220px] ${
                    dragActive
                      ? 'border-[#0E382B] bg-[#E8F4D9]/40'
                      : 'border-[#CBD5C4] hover:border-[#0E382B] hover:bg-[#F9FAF6]'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-[#F4F5EF] flex items-center justify-center text-[#55655C]">
                    <Upload size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#15221B]">
                      Drag and drop an image here or click to browse
                    </p>
                    <p className="text-[11px] text-[#7A8B80] mt-1">JPG, PNG, WEBP (Max 10MB)</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative rounded-2xl overflow-hidden h-52 bg-stone-900 border border-[#E2E6DC]">
                    <img src={imageUrl} alt="Uploaded damage" className="w-full h-full object-cover" />
                    {/* Bounding box preview if analyzed */}
                    {analysisResult && (
                      <div className="absolute inset-x-12 inset-y-8 border-2 border-[#C8F169] rounded-xl pointer-events-none flex items-start p-1 bg-black/10">
                        <span className="bg-[#0E382B] text-[#C8F169] text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                          {analysisResult.category} ({analysisResult.confidence}%)
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 py-2 px-3 rounded-xl border border-[#E2E6DC] bg-[#F7F8F4] text-xs font-medium text-[#15221B] hover:bg-[#EEF1E8] transition-colors flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw size={12} /> Replace
                    </button>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="flex-1 py-2 px-3 rounded-xl border border-red-200 bg-red-50 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <X size={12} /> Remove
                    </button>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
            </div>

            {/* Example Images Gallery */}
            <div className="pt-2 border-t border-[#EDF1EA]">
              <p className="text-xs font-bold text-[#15221B] mb-2">Example Images</p>
              <div className="grid grid-cols-5 gap-2">
                {exampleImages.map((ex) => (
                  <button
                    key={ex.label}
                    type="button"
                    onClick={() => selectExample(ex)}
                    className="group relative rounded-xl overflow-hidden h-14 border border-[#E2E6DC] hover:border-[#0E382B] focus:ring-2 focus:ring-[#0E382B] transition-all"
                    title={ex.label}
                  >
                    <img src={ex.url} alt={ex.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    <span className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors" />
                    <span className="absolute bottom-1 left-1 right-1 text-[8px] font-bold text-white truncate drop-shadow">
                      {ex.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2 (Right 6-cols): Report Details */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-5 sm:p-6 border border-[#E2E6DC] shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#15221B]">2. Report Details</h2>

            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="description" className="text-xs font-bold text-[#15221B]">
                  Description *
                </label>
                <span className="text-[10px] text-[#7A8B80]">{description.length}/500</span>
              </div>
              <textarea
                id="description"
                rows={3}
                maxLength={500}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setErrors((p) => ({ ...p, description: '' }));
                }}
                placeholder="Briefly describe the road damage you observed..."
                className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F8F9F5] border text-xs text-[#15221B] placeholder:text-[#8B9C92] focus:outline-none focus:border-[#0E382B] focus:bg-white transition-all resize-none ${
                  errors.description ? 'border-red-400' : 'border-[#E2E6DC]'
                }`}
              />
              {errors.description && (
                <p className="text-[11px] text-red-500 mt-1">{errors.description}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="text-xs font-bold text-[#15221B] block mb-1.5">
                Location *
              </label>
              <div className="relative">
                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setErrors((p) => ({ ...p, location: '' }));
                  }}
                  placeholder="e.g., Hazratganj Road, Lucknow"
                  className={`w-full pl-3.5 pr-9 py-2.5 rounded-xl bg-[#F8F9F5] border text-xs text-[#15221B] placeholder:text-[#8B9C92] focus:outline-none focus:border-[#0E382B] focus:bg-white transition-all ${
                    errors.location ? 'border-red-400' : 'border-[#E2E6DC]'
                  }`}
                />
                <button
                  type="button"
                  onClick={detectLocation}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7A8B80] hover:text-[#0E382B] p-1 rounded transition-colors"
                  title="Detect GPS"
                >
                  <Compass size={15} />
                </button>
              </div>
              {errors.location && (
                <p className="text-[11px] text-red-500 mt-1">{errors.location}</p>
              )}
            </div>

            {/* Latitude & Longitude */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="lat" className="text-[11px] font-medium text-[#65766D] block mb-1">
                  Latitude (optional)
                </label>
                <input
                  id="lat"
                  type="text"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="26.8467"
                  className="w-full px-3 py-2 rounded-xl bg-[#F8F9F5] border border-[#E2E6DC] text-xs text-[#15221B] placeholder:text-[#8B9C92] focus:outline-none focus:border-[#0E382B] focus:bg-white transition-all"
                />
              </div>
              <div>
                <label htmlFor="lng" className="text-[11px] font-medium text-[#65766D] block mb-1">
                  Longitude (optional)
                </label>
                <input
                  id="lng"
                  type="text"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="80.9462"
                  className="w-full px-3 py-2 rounded-xl bg-[#F8F9F5] border border-[#E2E6DC] text-xs text-[#15221B] placeholder:text-[#8B9C92] focus:outline-none focus:border-[#0E382B] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Category & Severity dropdowns */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="category" className="text-xs font-bold text-[#15221B] block mb-1.5">
                  Category *
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value as Category);
                    setErrors((p) => ({ ...p, category: '' }));
                  }}
                  className={`w-full px-3 py-2.5 rounded-xl bg-[#F8F9F5] border text-xs text-[#15221B] focus:outline-none focus:border-[#0E382B] focus:bg-white transition-all ${
                    errors.category ? 'border-red-400' : 'border-[#E2E6DC]'
                  }`}
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.category}</p>
                )}
              </div>

              <div>
                <label htmlFor="severity" className="text-xs font-bold text-[#15221B] block mb-1.5">
                  Severity *
                </label>
                <select
                  id="severity"
                  value={severity}
                  onChange={(e) => {
                    setSeverity(e.target.value as Severity);
                    setErrors((p) => ({ ...p, severity: '' }));
                  }}
                  className={`w-full px-3 py-2.5 rounded-xl bg-[#F8F9F5] border text-xs text-[#15221B] focus:outline-none focus:border-[#0E382B] focus:bg-white transition-all ${
                    errors.severity ? 'border-red-400' : 'border-[#E2E6DC]'
                  }`}
                >
                  <option value="">Select severity</option>
                  {severities.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.severity && (
                  <p className="text-[11px] text-red-500 mt-1">{errors.severity}</p>
                )}
              </div>
            </div>

            {/* Analyze Damage CTA Button */}
            <button
              type="button"
              onClick={runAnalysis}
              disabled={analyzing}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0E382B] text-white text-xs font-semibold hover:bg-[#154E3A] disabled:opacity-50 transition-all shadow-xs mt-2"
            >
              {analyzing ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Running AI Scanner Simulation...
                </>
              ) : (
                <>
                  <Sparkles size={15} className="text-[#C8F169]" />
                  Analyze Damage
                </>
              )}
            </button>
          </div>
        </div>

        {/* Simulated AI Analysis Result Card (Demo Mode) */}
        {analysisResult && (
          <div className="bg-[#F8FAF5] rounded-3xl p-5 sm:p-6 border border-[#CFDFBF] shadow-xs space-y-4 animate-fade-in">
            {/* Disclaimer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#DFEBD4]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2D5A20]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#2D5A20]">
                  Simulated AI Analysis (Demo Mode)
                </span>
              </div>
              <span className="text-[11px] text-[#65766D] italic hidden sm:inline-block">
                This is a simulated analysis for demonstration purposes. No real AI model is connected.
              </span>
            </div>

            {/* Result Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Thumbnail */}
              <div className="md:col-span-3 rounded-2xl overflow-hidden h-28 bg-stone-900 border border-[#E2E6DC] relative">
                <img
                  src={imageUrl}
                  alt="Detection preview"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 bg-[#0E382B] text-[#C8F169] text-[10px] font-bold px-2 py-0.5 rounded shadow">
                  {analysisResult.category}
                </span>
              </div>

              {/* Detected Metrics */}
              <div className="md:col-span-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#65766D]">Detected Category</span>
                  <span className="font-bold text-[#15221B]">{analysisResult.category}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#65766D]">Severity</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFEBEE] text-[#D32F2F] border border-[#FFCDD2]">
                    {analysisResult.severity}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#65766D]">Confidence</span>
                  <span className="font-bold text-[#2D5A20]">{analysisResult.confidence}%</span>
                </div>
                {/* Confidence Bar */}
                <div className="w-full h-1.5 rounded-full bg-[#E2EADC] overflow-hidden">
                  <div
                    className="h-full bg-[#2D5A20] rounded-full"
                    style={{ width: `${analysisResult.confidence}%` }}
                  />
                </div>
              </div>

              {/* Recommended Action & Edit Result */}
              <div className="md:col-span-5 p-3.5 rounded-2xl bg-white border border-[#DFEBD4] flex flex-col justify-between h-full">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A8B80] block mb-1">
                    Recommended Action
                  </span>
                  <p className="text-xs text-[#15221B] leading-relaxed">
                    {analysisResult.recommendedAction}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    showToast('You can freely adjust Category and Severity above', 'info');
                  }}
                  className="mt-2 self-start inline-flex items-center gap-1 text-[11px] font-semibold text-[#0E382B] hover:underline"
                >
                  <Edit3 size={11} /> Edit Result
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Submit Report Final Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#0E382B] text-white text-sm font-bold hover:bg-[#154E3A] active:bg-[#09291F] disabled:opacity-50 transition-all shadow-sm flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Submitting Report...
            </>
          ) : (
            <>
              <CheckCircle2 size={16} />
              Submit Report
            </>
          )}
        </button>
      </form>
    </div>
  );
}
