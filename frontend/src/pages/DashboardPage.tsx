import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './DashboardPage.css';

interface Job {
  _id: string;
  position: string;
  company: string;
  location: string;
  salary: string;
  experience: string;
  jobType: string;
  level: string;
  description: string;
  postedDate: string;
  matchPercentage?: number;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  skills: string[];
  profilePicture?: string;
  designation?: string;
  industry?: string;
  workplaceType?: string;
  salaryExpectation?: string;
  profileCompletion?: number;
}

type TabType = 'jobs' | 'saved' | 'profile';

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('jobs');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  
  // Search & Filter states
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedJobType, setSelectedJobType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedSalary, setSelectedSalary] = useState('all');
  const [filterOptions, setFilterOptions] = useState<any>({});

  // Profile edit mode
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  
  // Camera mode
  const [cameraMode, setCameraMode] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  // Fetch initial data
  useEffect(() => {
    fetchJobs();
    fetchFilters();
    fetchProfile();
    fetchSavedJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/jobs');
      setJobs(res.data.data);
      setFilteredJobs(res.data.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const fetchFilters = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/filters');
      setFilterOptions(res.data.data);
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/user/profile');
      setUserProfile(res.data.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/user/saved-jobs');
      setSavedJobs(res.data.data);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
    }
  };

  const handleResumeUpload = async (file: File) => {
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const res = await axios.post('http://localhost:5000/api/match-all', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setJobs(res.data.data);
        setFilteredJobs(res.data.data);
        setResumeUploaded(true);
        if (res.data.data.length > 0) {
          setSelectedJob(res.data.data[0]);
        }
        
        // Refresh profile data from updated resume
        await fetchProfile();
        alert('✅ Resume uploaded! Profile updated with your skills and experience.');
      }
    } catch (error) {
      console.error('Error matching resume:', error);
      alert('Error matching resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureUpload = async (file: File) => {
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);

      const res = await axios.post('http://localhost:5000/api/user/profile-picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setUserProfile(res.data.data);
        alert('✅ Profile picture updated successfully!');
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('Error uploading profile picture. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });

      setCameraStream(stream);
      setCameraMode(true);

      // Important: Set stream to video element after state updates
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(err => console.error('Video play error:', err));
        }
      }, 100);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions and try again.');
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    try {
      const context = canvasRef.current.getContext('2d');
      if (!context) return;

      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);

      // Convert canvas to blob and upload
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;

        const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
        await handleProfilePictureUpload(file);
        stopCamera();
      }, 'image/jpeg', 0.9);
    } catch (error) {
      console.error('Error capturing photo:', error);
      alert('Error capturing photo. Please try again.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setCameraMode(false);
  };

  const applyFilters = useCallback(() => {
    let filtered = [...jobs];

    // Level filter
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(j => j.level === selectedLevel);
    }

    // Job Type filter
    if (selectedJobType !== 'all') {
      filtered = filtered.filter(j => j.jobType === selectedJobType);
    }

    // Location filter
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(j => j.location.includes(selectedLocation));
    }

    // Salary filter
    if (selectedSalary !== 'all') {
      const minSalary = parseInt(selectedSalary);
      filtered = filtered.filter(j => {
        const baseSalary = parseInt(j.salary.split('-')[0]);
        return baseSalary >= minSalary;
      });
    }

    // Match filter
    if (filterCategory === 'matched' && resumeUploaded) {
      filtered = filtered.filter(j => (j.matchPercentage || 0) >= 70);
    } else if (filterCategory === 'unmatched' && resumeUploaded) {
      filtered = filtered.filter(j => (j.matchPercentage || 0) < 70);
    }

    // Search filter
    if (searchText) {
      filtered = filtered.filter(
        j =>
          j.position.toLowerCase().includes(searchText.toLowerCase()) ||
          j.company.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Sort by match if available
    if (resumeUploaded) {
      filtered.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));
    }

    setFilteredJobs(filtered);
  }, [searchText, filterCategory, selectedLevel, selectedJobType, selectedLocation, selectedSalary, jobs, resumeUploaded]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const toggleSaveJob = async (jobId: string) => {
    try {
      const isSaved = savedJobs.some(j => j._id === jobId);
      if (isSaved) {
        await axios.post('http://localhost:5000/api/user/unsave-job', { userId: 'user_1', jobId });
      } else {
        await axios.post('http://localhost:5000/api/user/save-job', { userId: 'user_1', jobId });
      }
      await fetchSavedJobs();
    } catch (error) {
      console.error('Error toggling saved job:', error);
    }
  };

  const updateProfile = async () => {
    if (!editedProfile) return;
    try {
      await axios.post('http://localhost:5000/api/user/profile', editedProfile);
      setUserProfile(editedProfile);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const getMatchColor = (percentage: number | undefined) => {
    if (!percentage) return '#999';
    if (percentage >= 70) return '#28a745';
    if (percentage >= 50) return '#ffc107';
    return '#dc3545';
  };

  const isSaved = selectedJob ? savedJobs.some(j => j._id === selectedJob._id) : false;

  return (
    <div className="naukri-container">
      {/* Header */}
      <div className="naukri-header">
        <div className="header-content">
          <h1>🔍 AI Resume & JD Matcher</h1>
          <label className="upload-btn">
            <input type="file" accept=".pdf,.txt" onChange={e => e.target.files && handleResumeUpload(e.target.files[0])} />
            📤 {resumeUploaded ? '✅ Change Resume' : 'Upload Resume'}
          </label>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button className={`tab-btn ${activeTab === 'jobs' ? 'active' : ''}`} onClick={() => setActiveTab('jobs')}>
          💼 Find Jobs
        </button>
        <button className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`} onClick={() => setActiveTab('saved')}>
          ❤️ Saved ({savedJobs.length})
        </button>
        <button className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
          👤 My Profile
          {userProfile && userProfile.profileCompletion && userProfile.profileCompletion < 100 && (
            <span className="profile-badge" style={{ backgroundColor: userProfile.profileCompletion >= 80 ? '#28a745' : '#ffc107' }}>
              {userProfile.profileCompletion}%
            </span>
          )}
        </button>
      </div>

      {/* JOBS TAB */}
      {activeTab === 'jobs' && (
        <div className="main-content">
          {/* Left Sidebar - Filters */}
          <div className="filters-sidebar">
            <div className="filter-section">
              <h3>🔍 Search</h3>
              <input
                type="text"
                placeholder="Search by position or company..."
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                className="search-input"
              />
            </div>

            {resumeUploaded && (
              <div className="filter-section">
                <h3>📊 Match Status</h3>
                <label className="filter-checkbox">
                  <input type="radio" name="match" value="all" checked={filterCategory === 'all'} onChange={() => setFilterCategory('all')} />
                  All Jobs ({jobs.length})
                </label>
                <label className="filter-checkbox">
                  <input type="radio" name="match" value="matched" checked={filterCategory === 'matched'} onChange={() => setFilterCategory('matched')} />
                  Good Match ({jobs.filter(j => (j.matchPercentage || 0) >= 70).length})
                </label>
                <label className="filter-checkbox">
                  <input type="radio" name="match" value="unmatched" checked={filterCategory === 'unmatched'} onChange={() => setFilterCategory('unmatched')} />
                  Other ({jobs.filter(j => (j.matchPercentage || 0) < 70).length})
                </label>
              </div>
            )}

            <div className="filter-section">
              <h3>💼 Experience Level</h3>
              <select value={selectedLevel} onChange={e => setSelectedLevel(e.target.value)} className="filter-select">
                <option value="all">All Levels</option>
                {filterOptions.levels?.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div className="filter-section">
              <h3>🏢 Job Type</h3>
              <select value={selectedJobType} onChange={e => setSelectedJobType(e.target.value)} className="filter-select">
                <option value="all">All Types</option>
                {filterOptions.jobTypes?.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="filter-section">
              <h3>📍 Location</h3>
              <select value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)} className="filter-select">
                <option value="all">All Locations</option>
                {filterOptions.locations?.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div className="filter-section">
              <h3>💰 Min Salary (LPA)</h3>
              <select value={selectedSalary} onChange={e => setSelectedSalary(e.target.value)} className="filter-select">
                <option value="all">All Salaries</option>
                {filterOptions.salaries?.map(sal => (
                  <option key={sal} value={sal.toString()}>{sal}+ LPA</option>
                ))}
              </select>
            </div>
          </div>

          {/* Middle - Jobs List */}
          <div className="jobs-list-container">
            {loading && <div className="loading">Loading matches...</div>}
            {filteredJobs.length === 0 ? (
              <div className="no-jobs">
                {resumeUploaded ? '📭 No jobs match your criteria' : '📤 Upload your resume to see job matches'}
              </div>
            ) : (
              filteredJobs.map(job => (
                <div
                  key={job._id}
                  className={`job-list-item ${selectedJob?._id === job._id ? 'selected' : ''}`}
                  onClick={() => setSelectedJob(job)}
                  style={{
                    borderLeft: resumeUploaded && job.matchPercentage ? `4px solid ${getMatchColor(job.matchPercentage)}` : '4px solid #ccc',
                  }}
                >
                  <div className="job-list-header">
                    <h4>{job.position}</h4>
                    {resumeUploaded && job.matchPercentage !== undefined && (
                      <span className="match-badge" style={{ backgroundColor: getMatchColor(job.matchPercentage) }}>
                        {job.matchPercentage}%
                      </span>
                    )}
                  </div>
                  <p className="company-tag">{job.company}</p>
                  <p className="location-tag">📍 {job.location}</p>
                </div>
              ))
            )}
          </div>

          {/* Right - Job Details */}
          <div className="job-details-container">
            {selectedJob ? (
              <>
                <div className="job-details-header">
                  <div>
                    <h2>{selectedJob.position}</h2>
                    <p className="company-name">{selectedJob.company}</p>
                  </div>
                  {resumeUploaded && selectedJob.matchPercentage !== undefined && (
                    <div className="match-circle" style={{ backgroundColor: getMatchColor(selectedJob.matchPercentage) }}>
                      {selectedJob.matchPercentage}%
                    </div>
                  )}
                </div>

                <div className="job-meta">
                  <div className="meta-row">
                    <span className="meta-label">📍 Location:</span>
                    <span>{selectedJob.location}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">💰 Salary:</span>
                    <span>{selectedJob.salary}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">📅 Experience:</span>
                    <span>{selectedJob.experience}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">🏢 Job Type:</span>
                    <span>{selectedJob.jobType}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">⭐ Level:</span>
                    <span>{selectedJob.level}</span>
                  </div>
                </div>

                <div className="job-description">
                  <h3>About the Job</h3>
                  <p>{selectedJob.description}</p>
                </div>

                <div className="job-actions">
                  {resumeUploaded && selectedJob.matchPercentage && selectedJob.matchPercentage >= 70 ? (
                    <button className="apply-btn">🚀 Apply Now</button>
                  ) : (
                    <button className="apply-btn disabled">Apply</button>
                  )}
                  <button 
                    className={`save-btn ${isSaved ? 'saved' : ''}`}
                    onClick={() => toggleSaveJob(selectedJob._id)}
                  >
                    {isSaved ? '❤️ Saved' : '🤍 Save'}
                  </button>
                </div>
              </>
            ) : (
              <div className="no-selection">
                <p>👈 Select a job to view details</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SAVED JOBS TAB */}
      {activeTab === 'saved' && (
        <div className="saved-jobs-container">
          {savedJobs.length === 0 ? (
            <div className="empty-state">
              <p>You haven't saved any jobs yet</p>
              <p>Start exploring and save jobs you're interested in!</p>
            </div>
          ) : (
            <div className="saved-jobs-grid">
              {savedJobs.map(job => (
                <div key={job._id} className="saved-job-card">
                  <h3>{job.position}</h3>
                  <p className="company">{job.company}</p>
                  <p className="location">📍 {job.location}</p>
                  <p className="salary">💰 {job.salary}</p>
                  <p className="experience">📅 {job.experience}</p>
                  <div className="card-actions">
                    <button className="btn-apply">Apply</button>
                    <button className="btn-unsave" onClick={() => toggleSaveJob(job._id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PROFILE TAB */}
      {activeTab === 'profile' && (
        <div className="profile-container">
          {userProfile && (
            <>
              <div className="profile-header">
                <div>
                  <h2>👤 My Profile</h2>
                  {resumeUploaded && <p className="profile-subtitle">📄 Auto-populated from your resume</p>}
                </div>
                <button className="edit-btn" onClick={() => { setEditMode(!editMode); setEditedProfile(userProfile); }}>
                  {editMode ? '❌ Cancel' : '✏️ Edit'}
                </button>
              </div>

              {/* Profile Completion */}
              <div className="profile-completion">
                <div className="completion-header">
                  <span className="completion-label">Profile Strength</span>
                  <span className="completion-percentage">{userProfile.profileCompletion || 0}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${userProfile.profileCompletion || 0}%`,
                      backgroundColor: (userProfile.profileCompletion || 0) >= 80 ? '#28a745' : (userProfile.profileCompletion || 0) >= 50 ? '#ffc107' : '#dc3545'
                    }}
                  />
                </div>
                <p className="completion-text">
                  {(userProfile.profileCompletion || 0) >= 80 ? '✅ Profile is complete!' : '⚠️ Complete your profile to improve visibility'}
                </p>
              </div>

              {editMode && editedProfile ? (
                <div className="profile-edit">
                  {/* Profile Picture Upload */}
                  <div className="profile-picture-section">
                    <div className="profile-picture-container">
                      {cameraMode ? (
                        <div className="camera-mode">
                          <video 
                            ref={videoRef}
                            autoPlay 
                            playsInline
                            className="camera-video"
                          />
                          <canvas ref={canvasRef} style={{ display: 'none' }} />
                        </div>
                      ) : editedProfile.profilePicture ? (
                        <img src={editedProfile.profilePicture} alt="Profile" className="profile-picture" />
                      ) : (
                        <div className="profile-picture-placeholder">
                          <span>📷</span>
                        </div>
                      )}
                    </div>
                    <div className="picture-upload">
                      {!cameraMode ? (
                        <>
                          <label htmlFor="profile-pic-input" className="upload-btn">
                            📤 Upload Picture (15%)
                          </label>
                          <input 
                            id="profile-pic-input"
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleProfilePictureUpload(e.target.files[0]);
                              }
                            }}
                            style={{ display: 'none' }}
                          />
                          <button 
                            className="camera-btn"
                            onClick={startCamera}
                          >
                            📸 Take Photo
                          </button>
                          {editedProfile.profilePicture && (
                            <button 
                              className="remove-pic-btn"
                              onClick={() => setEditedProfile({ ...editedProfile, profilePicture: undefined })}
                            >
                              ❌ Remove Picture
                            </button>
                          )}
                        </>
                      ) : (
                        <>
                          <button 
                            className="capture-btn"
                            onClick={capturePhoto}
                          >
                            ✅ Capture Photo
                          </button>
                          <button 
                            className="cancel-camera-btn"
                            onClick={stopCamera}
                          >
                            ❌ Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Basic Fields */}
                  <div className="form-section">
                    <h3>Basic Information</h3>
                    <div className="form-group">
                      <label>Name: (14%)</label>
                      <input type="text" value={editedProfile.name} onChange={e => setEditedProfile({ ...editedProfile, name: e.target.value })} placeholder="Enter your full name" />
                    </div>
                    <div className="form-group">
                      <label>Email: (14%)</label>
                      <input type="email" value={editedProfile.email} onChange={e => setEditedProfile({ ...editedProfile, email: e.target.value })} placeholder="Enter your email" />
                    </div>
                    <div className="form-group">
                      <label>Phone: (14%)</label>
                      <input type="tel" value={editedProfile.phone} onChange={e => setEditedProfile({ ...editedProfile, phone: e.target.value })} placeholder="Enter your phone" />
                    </div>
                    <div className="form-group">
                      <label>Location: (14%)</label>
                      <input type="text" value={editedProfile.location} onChange={e => setEditedProfile({ ...editedProfile, location: e.target.value })} placeholder="City, Country" />
                    </div>
                    <div className="form-group">
                      <label>Experience: (14%)</label>
                      <input type="text" value={editedProfile.experience} onChange={e => setEditedProfile({ ...editedProfile, experience: e.target.value })} placeholder="e.g., 5+ Years" />
                    </div>
                  </div>

                  {/* Professional Details */}
                  <div className="form-section">
                    <h3>Professional Details (15%)</h3>
                    <div className="form-group">
                      <label>Designation:</label>
                      <select value={editedProfile.designation || ''} onChange={e => setEditedProfile({ ...editedProfile, designation: e.target.value })}>
                        <option value="">Select Designation</option>
                        {filterOptions.profileOptions?.designations?.map((d: string) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Industry:</label>
                      <select value={editedProfile.industry || ''} onChange={e => setEditedProfile({ ...editedProfile, industry: e.target.value })}>
                        <option value="">Select Industry</option>
                        {filterOptions.profileOptions?.industries?.map((i: string) => (
                          <option key={i} value={i}>{i}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Workplace Type:</label>
                      <select value={editedProfile.workplaceType || ''} onChange={e => setEditedProfile({ ...editedProfile, workplaceType: e.target.value })}>
                        <option value="">Select Workplace Type</option>
                        {filterOptions.profileOptions?.workplaceTypes?.map((w: string) => (
                          <option key={w} value={w}>{w}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Salary Expectation:</label>
                      <select value={editedProfile.salaryExpectation || ''} onChange={e => setEditedProfile({ ...editedProfile, salaryExpectation: e.target.value })}>
                        <option value="">Select Salary Range</option>
                        {filterOptions.profileOptions?.salaryRanges?.map((s: string) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="form-section">
                    <h3>Skills</h3>
                    <div className="form-group">
                      <label>Skills (comma separated):</label>
                      <input type="text" value={editedProfile.skills.join(', ')} onChange={e => setEditedProfile({ ...editedProfile, skills: e.target.value.split(',').map(s => s.trim()) })} placeholder="React, Node.js, TypeScript, ..." />
                    </div>
                  </div>

                  <button className="save-profile-btn" onClick={updateProfile}>💾 Save Profile</button>
                </div>
              ) : (
                <div className="profile-view">
                  {/* Profile Picture Display */}
                  <div className="profile-picture-display-section">
                    {userProfile.profilePicture ? (
                      <img src={userProfile.profilePicture} alt="Profile" className="profile-picture-large" />
                    ) : (
                      <div className="profile-picture-placeholder-large">
                        <span>📷</span>
                      </div>
                    )}
                  </div>

                  <div className="profile-info">
                    <div className="info-section">
                      <h3>Basic Information</h3>
                      <div className="info-item">
                        <label>Name:</label>
                        <p>{userProfile.name}</p>
                      </div>
                      <div className="info-item">
                        <label>Email:</label>
                        <p>{userProfile.email}</p>
                      </div>
                      <div className="info-item">
                        <label>Phone:</label>
                        <p>{userProfile.phone}</p>
                      </div>
                      <div className="info-item">
                        <label>Location:</label>
                        <p>{userProfile.location}</p>
                      </div>
                      <div className="info-item">
                        <label>Experience:</label>
                        <p>{userProfile.experience}</p>
                      </div>
                    </div>

                    <div className="info-section">
                      <h3>Professional Details</h3>
                      <div className="info-item">
                        <label>Designation:</label>
                        <p>{userProfile.designation || 'Not specified'}</p>
                      </div>
                      <div className="info-item">
                        <label>Industry:</label>
                        <p>{userProfile.industry || 'Not specified'}</p>
                      </div>
                      <div className="info-item">
                        <label>Workplace Type:</label>
                        <p>{userProfile.workplaceType || 'Not specified'}</p>
                      </div>
                      <div className="info-item">
                        <label>Salary Expectation:</label>
                        <p>{userProfile.salaryExpectation || 'Not specified'}</p>
                      </div>
                    </div>

                    <div className="info-section">
                      <h3>Skills</h3>
                      <div className="skills-list">
                        {userProfile.skills.map(skill => (
                          <span key={skill} className="skill-tag">{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
