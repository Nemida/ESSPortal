import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const FormDisplayPage = () => {
  const { formId } = useParams();
  const [formInfo, setFormInfo] = useState(null);
  const [FormComponent, setFormComponent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadForm = async () => {
      try {
        const res = await api.get(`/api/forms/${formId}`);
        const fetchedFormInfo = res.data;
        setFormInfo(fetchedFormInfo);

        if (fetchedFormInfo && fetchedFormInfo.component_name) {
          const FormComponent = lazy(() => import(`../components/forms/${fetchedFormInfo.component_name}.jsx`));
          setFormComponent(FormComponent);
        }
      } catch (error) {
        console.error("Failed to load form", error);
      } finally {
        setLoading(false);
      }
    };
    loadForm();
  }, [formId]);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 font-serif">
      <div className="mb-4 no-print">
        <Link to="/forms" className="text-sm font-semibold text-indigo-600 hover:underline">
          ← Back to Forms Portal
        </Link>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="border-b pb-4 mb-6">
          <h1 className="text-3xl font-bold text-[#2c3e50]">
            {loading ? 'Loading Form...' : formInfo?.title}
          </h1>
        </div>
        
        <Suspense fallback={<div>Loading form component...</div>}>
          {FormComponent ? <FormComponent formInfo={formInfo} /> : <p>Form not found or is under development.</p>}
        </Suspense>
      </div>
    </div>
  );
};

export default FormDisplayPage;