import { useState } from 'react';
import { useAppDispatch } from './useRedux';
import { matchingService } from '../services/index';
import { setCurrentMatch, setLoading, setError } from '../store/matchingSlice';

/**
 * File Matching Hook
 */
export const useFileMatching = () => {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const compareFiles = async (resume: File, jdFile: File) => {
    setIsSubmitting(true);
    dispatch(setLoading(true));

    try {
      const response = await matchingService.compareResumeWithJD(resume, jdFile);

      if (response.success) {
        dispatch(
          setCurrentMatch({
            id: response.data.resultId,
            matchPercentage: response.data.matchPercentage,
            matchedKeywords: response.data.matchedKeywords,
            missingSkills: response.data.missingSkills,
            suggestions: response.data.suggestions,
          })
        );
        return { success: true, data: response.data };
      } else {
        dispatch(setError(response.message || 'Comparison failed'));
        return { success: false, error: response.message };
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'An error occurred';
      dispatch(setError(errorMsg));
      return { success: false, error: errorMsg };
    } finally {
      setIsSubmitting(false);
      dispatch(setLoading(false));
    }
  };

  return { compareFiles, isSubmitting };
};
