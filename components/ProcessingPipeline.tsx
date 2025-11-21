import React, { useEffect, useState } from 'react';
import { CheckCircle2, Circle, Loader2, Server, FileText, BrainCircuit, PenTool, Database } from 'lucide-react';
import { ProcessingStep } from '../types';

interface ProcessingPipelineProps {
  channelName: string;
  dataReady: boolean;
  onComplete: () => void;
}

export const ProcessingPipeline: React.FC<ProcessingPipelineProps> = ({ channelName, dataReady, onComplete }) => {
  const [steps, setSteps] = useState<ProcessingStep[]>([
    { id: 1, label: 'Channel Metadata Retrieval', details: 'Querying YouTube Data API v3...', status: 'pending' },
    { id: 2, label: 'Content Extraction', details: 'Fetching transcripts via Caption API...', status: 'pending' },
    { id: 3, label: 'Natural Language Processing', details: 'Entity extraction & summarization (Google Cloud NLP)...', status: 'pending' },
    { id: 4, label: 'Data Consolidation', details: 'Merging metadata with semantic analysis...', status: 'pending' },
    { id: 5, label: 'Encyclopaedia Publication', details: 'Generating pages via MediaWiki Action API...', status: 'pending' },
  ]);

  useEffect(() => {
    // Simulate the pipeline progression visually
    let stepIndex = 0;

    const interval = setInterval(() => {
      // Capture the current index for the state update closure to avoid race conditions
      const currentIndex = stepIndex;

      setSteps(prev => {
        // Create deep copy for immutability
        const newSteps = prev.map(s => ({ ...s }));
        
        // Mark previous step as completed
        if (currentIndex > 0) {
          const prevIndex = currentIndex - 1;
          if (newSteps[prevIndex]) {
            newSteps[prevIndex].status = 'completed';
          }
        }

        // Mark current step as active
        if (currentIndex < newSteps.length) {
          if (newSteps[currentIndex]) {
            newSteps[currentIndex].status = 'active';
          }
        }

        return newSteps;
      });

      stepIndex++;

      // Stop interval when we exceed the number of steps
      if (stepIndex > 5) {
        clearInterval(interval);
      }
    }, 1200); // 1.2 seconds per step

    return () => clearInterval(interval);
  }, []);

  // Watch for data readiness to force completion if animation is done
  useEffect(() => {
    const allDone = steps[steps.length - 1].status === 'completed';
    if (dataReady && allDone) {
      const timer = setTimeout(onComplete, 800);
      return () => clearTimeout(timer);
    }
  }, [dataReady, steps, onComplete]);

  const getIcon = (status: string, index: number) => {
    if (status === 'completed') return <CheckCircle2 className="text-green-500" />;
    if (status === 'active') return <Loader2 className="text-blue-500 animate-spin" />;
    return <Circle className="text-slate-300" />;
  };

  const getStepIcon = (index: number) => {
      switch(index) {
          case 0: return <Database size={20}/>;
          case 1: return <FileText size={20}/>;
          case 2: return <BrainCircuit size={20}/>;
          case 3: return <Server size={20}/>;
          case 4: return <PenTool size={20}/>;
          default: return <Circle size={20}/>;
      }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Automated Archival Workflow</h2>
          <p className="text-slate-500">Processing channel: <span className="font-semibold text-blue-600">{channelName}</span></p>
        </div>

        <div className="space-y-6 relative">
          {/* Vertical Line */}
          <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-100 -z-10"></div>

          {steps.map((step, idx) => (
            <div key={step.id} className={`flex items-start gap-4 transition-all duration-500 ${step.status === 'pending' ? 'opacity-50' : 'opacity-100'}`}>
              <div className={`mt-1 bg-white p-1 rounded-full z-10 ${step.status === 'active' ? 'scale-110' : ''} transition-transform`}>
                {getIcon(step.status, idx)}
              </div>
              <div className="flex-1 bg-slate-50 p-4 rounded-lg border border-slate-100 flex items-center gap-4">
                <div className={`p-2 rounded-md ${step.status === 'active' ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>
                    {getStepIcon(idx)}
                </div>
                <div>
                    <h3 className={`font-semibold ${step.status === 'active' ? 'text-blue-700' : 'text-slate-700'}`}>{step.label}</h3>
                    <p className="text-xs text-slate-500 mt-1 font-mono">{step.details}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {!dataReady && steps[steps.length - 1].status === 'completed' && (
             <div className="mt-8 text-center text-slate-500 animate-pulse text-sm">
                Finalizing MediaWiki generation...
             </div>
        )}
      </div>
    </div>
  );
};