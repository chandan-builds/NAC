import React, { useState, useEffect } from 'react';
import { Package, Truck, AlertCircle, CheckCircle2, MapPin, FileText, Send, Loader2, Navigation, Settings, X } from 'lucide-react';

const initialData = {
  allPiecesWithSameDimensions: false,
  childClient_code: 'JO2280',
  childClient_id: '1964505159350355637',
  code: 'JO2280',
  id: '1964505159350355637',
  codCollectionMode: '',
  commodityId: '72',
  consignmentCategory: 'domestic',
  consignmentFlowType: 'Standard',
  consignmentType: 'forward',
  courierType: 'NON-DOCUMENT',
  createdBy: 'JO2280 (Customer)',
  currency: 'INR',
  customerUserId: '1964505159350355637',
  declaredPrice: '4500',
  dimensionUnit: 'cm',
  dimensions_length: 1,
  dimensions_width: 1,
  dimensions_height: 1,
  dstAddress_name: '',
  dstAddress_phone: '',
  dstAddress_addressLine1: '',
  dstAddress_addressLine2: '',
  dstAddress_businessCategory: '',
  dstAddress_cityName: '',
  dstAddress_stateName: '',
  dstAddress_countryName: '',
  dstAddress_pincode: '',
  dstAddress_gstIn: '',
  dstAddress_id: '6989f97871a36196a7953460',
  dstAddress_isInternational: false,
  ewbDate: '2026-04-14',
  isBookedUsingV2: true,
  isFragile: false,
  isInternational: false,
  isRetailTransaction: false,
  isRiskSurchargeApplicable: false,
  isSpecialPincodeChargesApplicable: false,
  numberOfPieces: 1,
  pickupCommercialOtherDocs: false,
  pickupDate: '2026-04-14',
  pickupEwaybill: false,
  pickupKyc: false,
  pickupTimeSlotStart: '22:00',
  pickupTimeSlotEnd: '23:59',
  referenceNumber: '',
  serviceType: 'SURFACE EXPRESS',
  srcAddress_name: 'Namit Arora classes',
  srcAddress_phone: '7048913484',
  srcAddress_addressLine1: '807, Tower 18, Motia royal citi, zirakpur',
  srcAddress_businessCategory: '',
  srcAddress_cityName: 'ZIRAKPUR',
  srcAddress_stateName: 'PUNJAB',
  srcAddress_countryName: '',
  srcAddress_pincode: '140603',
  srcAddress_gstIn: '',
  srcAddress_id: '6989c905ce44c10a2b1a7af7',
  srcAddress_isInternational: false,
  typeOfDelivery: 'HOME_DELIVERY',
  weight: '',
  weightUnit: 'kg'
};

const optionalFields = [
  'codCollectionMode',
  'dstAddress_addressLine2',
  'dstAddress_businessCategory',
  'dstAddress_countryName',
  'dstAddress_gstIn',
  'srcAddress_businessCategory',
  'srcAddress_countryName',
  'srcAddress_gstIn',
];

const Section = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
  <div className="bg-white rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#E2E8F0] p-[20px] mb-[16px]">
    <div className="text-[12px] uppercase tracking-[0.05em] font-semibold text-[#64748B] mb-[15px] flex items-center">
      {title}
      <span className="ml-auto text-[#EF4444] text-[10px] font-normal tracking-normal capitalize">Validation Active</span>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[12px]">
      {children}
    </div>
  </div>
);

const Field = ({ 
  label, name, type = 'text', className = '', formData, errors, handleChange, helperText, helperState = 'default'
}: { 
  label: string, name: string, type?: string, className?: string, formData: any, errors: any, handleChange: any, helperText?: string, helperState?: 'default'|'error'|'success'|'checking' 
}) => {
  const error = errors[name];
  const isRequired = !optionalFields.includes(name) && type !== 'checkbox';
  
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-[11px] font-medium text-[#64748B] flex justify-between">
        <span>{label} {isRequired && <span className="text-[#EF4444] ml-0.5">*</span>}</span>
        {helperText && (
          <span className={`text-[10px] ${helperState === 'error' ? 'text-[#EF4444]' : helperState === 'success' ? 'text-emerald-600' : helperState === 'checking' ? 'text-blue-500 animate-pulse' : 'text-[#64748B]'}`}>
            {helperText}
          </span>
        )}
      </label>
      {type === 'checkbox' ? (
        <div className="flex items-center gap-2 px-[12px] py-[8px] border border-[#CBD5E1] rounded-[6px] bg-[#F8FAFC]">
          <input
            type="checkbox"
            id={name}
            name={name}
            className="w-4 h-4 text-[#3B82F6] rounded border-[#CBD5E1] focus:ring-[#3B82F6] cursor-pointer"
            checked={formData[name] as boolean}
            onChange={handleChange}
          />
          <label htmlFor={name} className="text-[13px] text-[#334155] cursor-pointer flex-1 select-none">
            Enabled
          </label>
        </div>
      ) : (
        <input
          type={type}
          name={name}
          value={formData[name] as string | number}
          onChange={handleChange}
          className={`w-full px-[12px] py-[8px] text-[13px] rounded-[6px] border transition-colors focus:outline-none 
            ${error ? 'border-[#EF4444] bg-[#FEF2F2] focus:border-[#EF4444] error-ring' : 'border-[#CBD5E1] focus:border-[#3B82F6] bg-[#F8FAFC] focus:bg-[#FFF] text-[#334155] placeholder:text-slate-400'}`}
        />
      )}
    </div>
  );
};

export default function App() {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [tokenStatus, setTokenStatus] = useState<'fetching' | 'ready' | 'error'>('fetching');
  const [pinStatus, setPinStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);

  // Auto-hide toast after 5s
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  useEffect(() => {
    const fetchTokenOnBoot = async () => {
      try {
        const resp = await fetch('/api/token');
        const data = await resp.json();
        if (data.token) {
          setAuthToken(data.token);
          setTokenStatus('ready');
        } else {
          setTokenStatus('error');
        }
      } catch {
        setTokenStatus('error');
      }
    };
    fetchTokenOnBoot();
  }, []);

  useEffect(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;

    const currentHour = now.getHours();
    const startHour = Math.floor(currentHour / 2) * 2;
    const endHour = startHour + 2;

    const startStr = `${String(startHour).padStart(2, '0')}:00`;
    const endStr = endHour >= 24 ? '23:59' : `${String(endHour).padStart(2, '0')}:00`;

    setFormData(prev => ({
      ...prev,
      pickupDate: dateStr,
      ewbDate: dateStr,
      pickupTimeSlotStart: startStr,
      pickupTimeSlotEnd: endStr,
    }));
  }, []);

  // Check pincode serviceability dynamically
  useEffect(() => {
    const pin = formData.dstAddress_pincode;
    // Basic test if it looks like a valid pincode before pinging API
    if (!pin || pin.length < 6) {
      setPinStatus('idle');
      return;
    }

    const checkPincode = async () => {
      setPinStatus('checking');
      try {
        const res = await fetch('/api/pincode-check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ desPincode: pin })
        });
        const data = await res.json();
        
        // Usually CTBS API returns either simple error response or empty info if it's invalid
        if (!res.ok || data?.status === 'FAILED' || data?.status === 'FAIL' || data?.error || (Array.isArray(data) && data.length === 0)) {
          setPinStatus('invalid');
        } else {
          setPinStatus('valid');
          
          // Auto-fill City and State if the API returns them
          const destPinData = data?.PIN_CITY?.find?.((p: any) => p.PIN === pin);
          if (destPinData) {
            setFormData(prev => ({
              ...prev,
              dstAddress_cityName: destPinData.CITY || prev.dstAddress_cityName,
              dstAddress_stateName: destPinData.STATE_NAME || prev.dstAddress_stateName,
              dstAddress_countryName: "IN"
            }));
          } else if (data?.ZIPCODE_RESP?.[0]) {
            setFormData(prev => ({
              ...prev,
              dstAddress_cityName: data.ZIPCODE_RESP[0].DESTCITY || prev.dstAddress_cityName,
              dstAddress_stateName: data.ZIPCODE_RESP[0].DESTSTATE || prev.dstAddress_stateName,
            }));
          }
        }
      } catch (err) {
        setPinStatus('invalid');
      }
    };

    const timeoutId = setTimeout(() => {
      checkPincode();
    }, 600); // 600ms debounce
    return () => clearTimeout(timeoutId);
  }, [formData.dstAddress_pincode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let finalValue: any = value;
    
    if (type === 'checkbox') {
      finalValue = (e.target as HTMLInputElement).checked;
    } else if (type === 'number') {
      finalValue = value === '' ? '' : Number(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: finalValue }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === 'boolean') return; // skip booleans
      
      // Strings empty validation
      if (typeof value === 'string' && value.trim() === '') {
        if (!optionalFields.includes(key)) {
          newErrors[key] = 'This field is required';
        }
      }
      
      // Number > 0 validation
      if (typeof value === 'number' && (isNaN(value) || value <= 0)) {
        newErrors[key] = 'Must be greater than 0';
      }
    });

    // Specific Regex validations
    if (formData.srcAddress_phone && !/^\d{10,}$/.test(formData.srcAddress_phone)) {
      newErrors.srcAddress_phone = 'Min 10 digits required';
    }
    if (formData.dstAddress_phone && !/^\d{10,}$/.test(formData.dstAddress_phone)) {
      newErrors.dstAddress_phone = 'Min 10 digits required';
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      // Find the first error element and firmly scroll it into view
      setTimeout(() => {
         const errorEl = document.querySelector('.error-ring');
         if (errorEl) errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return false;
    }
    return true;
  };

  const generatePayload = () => ({
    allPiecesWithSameDimensions: formData.allPiecesWithSameDimensions,
    childClient: {
      code: formData.childClient_code,
      id: formData.childClient_id
    },
    code: formData.code,
    id: formData.id,
    codCollectionMode: formData.codCollectionMode || null,
    commodityId: formData.commodityId.split(',').map(s => s.trim()),
    consignmentCategory: formData.consignmentCategory,
    consignmentFlowType: formData.consignmentFlowType,
    consignmentType: formData.consignmentType,
    courierType: formData.courierType,
    createdBy: formData.createdBy,
    currency: formData.currency,
    customerUserId: formData.customerUserId,
    declaredPrice: String(formData.declaredPrice),
    dimensionUnit: formData.dimensionUnit,
    dimensions: {
      length: Number(formData.dimensions_length),
      width: Number(formData.dimensions_width),
      height: Number(formData.dimensions_height)
    },
    dstAddress: {
      addType: 'Destination',
      name: formData.dstAddress_name,
      phone: formData.dstAddress_phone,
      addressLine1: formData.dstAddress_addressLine1,
      ...(formData.dstAddress_addressLine2.trim() !== '' ? { addressLine2: formData.dstAddress_addressLine2 } : {}),
      businessCategory: formData.dstAddress_businessCategory,
      cityName: formData.dstAddress_cityName,
      stateName: formData.dstAddress_stateName,
      countryName: formData.dstAddress_countryName || 'IN',
      pincode: formData.dstAddress_pincode,
      gstIn: formData.dstAddress_gstIn,
      id: formData.dstAddress_id,
      isInternational: formData.dstAddress_isInternational
    },
    ewbDate: formData.ewbDate,
    isBookedUsingV2: formData.isBookedUsingV2,
    isFragile: formData.isFragile,
    isInternational: formData.isInternational,
    isRetailTransaction: formData.isRetailTransaction,
    isRiskSurchargeApplicable: formData.isRiskSurchargeApplicable,
    isSpecialPincodeChargesApplicable: formData.isSpecialPincodeChargesApplicable,
    numberOfPieces: Number(formData.numberOfPieces),
    pickupCommercialOtherDocs: formData.pickupCommercialOtherDocs,
    pickupDate: formData.pickupDate,
    pickupEwaybill: formData.pickupEwaybill,
    pickupKyc: formData.pickupKyc,
    pickupTimeSlotStart: formData.pickupTimeSlotStart,
    pickupTimeSlotEnd: formData.pickupTimeSlotEnd,
    referenceNumber: formData.referenceNumber,
    serviceType: formData.serviceType,
    srcAddress: {
      addType: 'Origin',
      name: formData.srcAddress_name,
      phone: formData.srcAddress_phone,
      addressLine1: formData.srcAddress_addressLine1,
      businessCategory: formData.srcAddress_businessCategory,
      cityName: formData.srcAddress_cityName,
      stateName: formData.srcAddress_stateName,
      countryName: formData.srcAddress_countryName,
      pincode: formData.srcAddress_pincode,
      gstIn: formData.srcAddress_gstIn,
      id: formData.srcAddress_id,
      isInternational: formData.srcAddress_isInternational
    },
    typeOfDelivery: formData.typeOfDelivery,
    weight: Number(formData.weight),
    weightUnit: formData.weightUnit
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    setStatus('idle');
    
    try {
      const payload = generatePayload();
      
      // Hit our Backend Proxy which bypasses browser CORS constraints
      const response = await fetch('/api/dtdc/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access-token': authToken || 'Ua5FVLtrf5CewuT2zh2nJj2kFfEyA7D2dVYvehGFE2Uhw686VaJ7rBCEWbFDVz8P'
        },
        body: JSON.stringify(payload)
      });
      
      const resData = await response.json().catch(() => null);
      
      if (!response.ok) {
        const errorMsg = resData?.message || resData?.error?.message || (typeof resData?.error === 'string' ? resData.error : null) || `HTTP Exception: ${response.status}`;
        throw new Error(errorMsg);
      }

      setApiResponse(resData);
      setStatus('success');
      setToast({ message: resData?.message || resData?.status || 'Consignment created successfully!', type: 'success' });
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setApiResponse({ error: err.message });
      setToast({ message: err.message || 'An error occurred while submitting.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-[#1E293B] bg-[#F1F5F9] font-sans p-[20px]">
      <div className="max-w-[980px] mx-auto flex flex-col h-full">
        {/* Header */}
        <header className="flex justify-between items-center mb-[20px] pb-[15px] border-b border-[#E2E8F0]">
          <div className="text-[20px] font-bold text-[#0F172A] tracking-[-0.02em]">Create New Consignment</div>
          <div className="font-mono bg-[#E2E8F0] px-[8px] py-[4px] rounded-[4px] text-[12px] text-[#475569]">REF: {formData.referenceNumber || 'UNASSIGNED'}</div>
        </header>

        <main className="w-full">
        
        {/* Token Alert Banner */}
        {tokenStatus === 'fetching' && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between gap-3 animate-pulse">
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
              <div className="text-sm font-medium text-blue-800">Booting Headless Browser & Fetching Auth Session. Please wait ~6 seconds...</div>
            </div>
          </div>
        )}
        
        {tokenStatus === 'error' && (
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-orange-600" />
              <div className="text-sm font-medium text-orange-800">Failed to auto-fetch auth session. We will use the fallback static token.</div>
            </div>
          </div>
        )}

        {/* Status Alerts */}
        {status === 'success' && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold text-emerald-800">Consignment Created Successfully</h3>
              <div className="text-sm text-emerald-700 mt-1 max-h-40 overflow-auto rounded bg-emerald-100/50 p-2 font-mono">
                {JSON.stringify(apiResponse, null, 2)}
              </div>
            </div>
          </div>
        )}
        
        {status === 'error' && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold text-rose-800">API Request Failed</h3>
              <div className="text-sm text-rose-700 mt-1">
                {apiResponse?.error || 'An unexpected error occurred while hitting the API endpoint.'}
                <br/>
                <span className="text-xs opacity-80 mt-2 block">Note: Direct frontend-to-backend calls often require CORS to be enabled on the target server.</span>
              </div>
            </div>
          </div>
        )}

        {Object.keys(errors).length > 0 && (
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-center justify-between gap-3 animate-pulse">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-orange-600" />
              <div className="text-sm font-medium text-orange-800">Your form has {Object.keys(errors).length} validation error(s). Please fix them before submitting.</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <Section title="Consignment Info" icon={Package}>
            <Field formData={formData} errors={errors} handleChange={handleChange} label="Reference Number" name="referenceNumber" />
            <Field formData={formData} errors={errors} handleChange={handleChange} label="Total Weight (kg)" name="weight" type="number" />
          </Section>

          <Section title="Destination Address (Delivery)" icon={Navigation}>
            <Field formData={formData} errors={errors} handleChange={handleChange} label="Name / Contact Info" name="dstAddress_name" />
            <Field formData={formData} errors={errors} handleChange={handleChange} label="Phone" name="dstAddress_phone" type="tel" />
            <Field 
              formData={formData} 
              errors={errors} 
              handleChange={handleChange} 
              label="Pincode" 
              name="dstAddress_pincode" 
              helperText={pinStatus === 'checking' ? 'Checking coverage...' : pinStatus === 'invalid' ? 'Not Deliverable' : pinStatus === 'valid' ? 'Deliverable ✓' : ''}
              helperState={pinStatus === 'checking' ? 'checking' : pinStatus === 'invalid' ? 'error' : pinStatus === 'valid' ? 'success' : 'default'}
            />
            <Field formData={formData} errors={errors} handleChange={handleChange} label="City" name="dstAddress_cityName" />
            <Field formData={formData} errors={errors} handleChange={handleChange} label="State" name="dstAddress_stateName" />
            <Field formData={formData} errors={errors} handleChange={handleChange} label="Address Line 1" name="dstAddress_addressLine1" className="md:col-span-2 lg:col-span-3" />
            <Field formData={formData} errors={errors} handleChange={handleChange} label="Address Line 2 (Optional)" name="dstAddress_addressLine2" className="md:col-span-2 lg:col-span-3" />
          </Section>

          <div className="mt-[20px] mb-[40px] p-[16px_20px] bg-white rounded-[12px] border border-[#E2E8F0] flex items-center justify-between">
             <div className="text-[13px] text-[#EF4444] flex items-center">
               <span className="mr-[8px]">●</span> All mandatory fields must be filled to enable API submission
             </div>
             <button
                type="submit"
                disabled={loading || tokenStatus === 'fetching' || pinStatus === 'checking' || pinStatus === 'invalid'}
                className="bg-[#94A3B8] hover:bg-[#64748b] active:bg-[#475569] disabled:opacity-70 disabled:cursor-not-allowed text-white px-[24px] py-[12px] rounded-[8px] font-semibold text-[14px] transition-all flex items-center justify-center gap-2 border-none"
              >
               {loading ? (
                 <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
               ) : (
                 'SUBMIT TO API'
               )}
             </button>
          </div>
        </form>
      </main>
      </div>
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] border flex items-center gap-3 transition-all animate-in fade-in slide-in-from-bottom-5 ${
          toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
          <span className="font-medium text-[14px] leading-snug max-w-[300px] break-words">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 opacity-50 hover:opacity-100 transition-opacity">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
