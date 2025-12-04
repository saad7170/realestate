import { useState, useEffect } from 'react';
import { propertyService } from '../services/api';

export const useProperties = (initialParams = {}) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 1,
  });

  const fetchProperties = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertyService.getProperties({ ...initialParams, ...params });
      setProperties(data.properties || data.data || []);
      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [initialParams.purpose, initialParams.propertyType, initialParams.subType, initialParams.city, initialParams.area]);

  return {
    properties,
    loading,
    error,
    pagination,
    refetch: fetchProperties,
  };
};

export const useProperty = (id) => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const data = await propertyService.getProperty(id);
        setProperty(data.property || data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  return { property, loading, error };
};
