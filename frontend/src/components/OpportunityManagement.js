import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Progress } from './ui/progress';
import { toast } from 'sonner';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Eye, 
  Edit, 
  Trash2,
  TrendingUp,
  Building,
  User,
  Calendar,
  DollarSign,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  Link,
  BarChart3,
  Award,
  Zap,
  FileText,
  Users,
  Shield,
  Activity,
  PieChart,
  LineChart,
  Settings,
  ChevronRight,
  ChevronDown,
  Star,
  AlertTriangle,
  Info,
  CheckSquare,
  XCircle,
  PlayCircle,
  PauseCircle,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import axios from 'axios';
import DataTable from './DataTable';
import ProtectedComponent from './ProtectedComponent';

const OpportunityManagement = () => {
  // State management
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Enhanced statistics with Phase 4 analytics
  const [statistics, setStatistics] = useState({
    totalOpportunities: 0,
    openOpportunities: 0,
    tenderOpportunities: 0,
    nonTenderOpportunities: 0,
    thisMonth: 0,
    // Phase 4 Analytics
    winRate: 0,
    averageDealSize: 0,
    averageSalesCycle: 0,
    qualificationRate: 0,
    totalPipelineValue: 0
  });

  // Phase 4: Analytics and KPI data
  const [analytics, setAnalytics] = useState(null);
  const [kpis, setKpis] = useState([]);
  const [teamPerformance, setTeamPerformance] = useState(null);
  
  // Phase 2: Qualification data
  const [qualificationRules, setQualificationRules] = useState([]);
  const [qualificationStatus, setQualificationStatus] = useState(null);
  const [stageHistory, setStageHistory] = useState([]);
  
  // Phase 3: Advanced features data
  const [opportunityDocuments, setOpportunityDocuments] = useState([]);
  const [opportunityClauses, setOpportunityClauses] = useState([]);
  const [importantDates, setImportantDates] = useState([]);
  const [wonDetails, setWonDetails] = useState(null);
  const [orderAnalysis, setOrderAnalysis] = useState(null);

  // Master data state
  const [masterData, setMasterData] = useState({
    approvedLeads: [],
    companies: [],
    users: [],
    stages: [],
    currencies: [],
    documentTypes: [],
    qualificationRules: []
  });

  // Form state for opportunity creation
  const [opportunityFormData, setOpportunityFormData] = useState({
    lead_id: '',
    opportunity_title: '',
    opportunity_type: '',
    company_id: '',
    opportunity_owner_id: '',
    partner_id: '',
    expected_closure_date: '',
    remarks: ''
  });

  // Form validation state
  const [validationErrors, setValidationErrors] = useState({});

  // API configuration
  const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Load data on component mount
  useEffect(() => {
    fetchOpportunities();
    fetchMasterData();
    fetchAnalytics();
    fetchKPIs();
    fetchTeamPerformance();
  }, []);

  // Fetch opportunities
  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/opportunities`, {
        headers: getAuthHeaders()
      });
      
      if (response.data.success) {
        setOpportunities(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      toast.error(error.response?.data?.detail || 'Failed to fetch opportunities');
    } finally {
      setLoading(false);
    }
  };

  // Phase 4: Fetch analytics
  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/opportunities/analytics`, {
        headers: getAuthHeaders(),
        params: { period: 'monthly' }
      });
      
      if (response.data.success) {
        setAnalytics(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  // Phase 4: Fetch KPIs
  const fetchKPIs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/opportunities/kpis`, {
        headers: getAuthHeaders()
      });
      
      if (response.data.success) {
        setKpis(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching KPIs:', error);
    }
  };

  // Phase 4: Fetch team performance
  const fetchTeamPerformance = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/opportunities/team-performance`, {
        headers: getAuthHeaders()
      });
      
      if (response.data.success) {
        setTeamPerformance(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching team performance:', error);
    }
  };

  // Phase 2: Fetch qualification data for selected opportunity
  const fetchQualificationData = async (opportunityId) => {
    try {
      // Fetch qualification rules
      const rulesResponse = await axios.get(`${API_BASE_URL}/api/opportunities/${opportunityId}/qualification-rules`, {
        headers: getAuthHeaders()
      });
      
      if (rulesResponse.data.success) {
        setQualificationRules(rulesResponse.data.data || []);
      }

      // Fetch qualification status
      const statusResponse = await axios.get(`${API_BASE_URL}/api/opportunities/${opportunityId}/qualification-status`, {
        headers: getAuthHeaders()
      });
      
      if (statusResponse.data.success) {
        setQualificationStatus(statusResponse.data.data);
      }

      // Fetch stage history
      const historyResponse = await axios.get(`${API_BASE_URL}/api/opportunities/${opportunityId}/stage-history`, {
        headers: getAuthHeaders()
      });
      
      if (historyResponse.data.success) {
        setStageHistory(historyResponse.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching qualification data:', error);
    }
  };

  // Phase 3: Fetch advanced features data for selected opportunity
  const fetchAdvancedFeaturesData = async (opportunityId) => {
    try {
      // Fetch documents
      const docsResponse = await axios.get(`${API_BASE_URL}/api/opportunities/${opportunityId}/documents`, {
        headers: getAuthHeaders()
      });
      
      if (docsResponse.data.success) {
        setOpportunityDocuments(docsResponse.data.data || []);
      }

      // Fetch clauses
      const clausesResponse = await axios.get(`${API_BASE_URL}/api/opportunities/${opportunityId}/clauses`, {
        headers: getAuthHeaders()
      });
      
      if (clausesResponse.data.success) {
        setOpportunityClauses(clausesResponse.data.data || []);
      }

      // Fetch important dates (if Tender)
      if (selectedOpportunity?.opportunity_type === 'Tender') {
        const datesResponse = await axios.get(`${API_BASE_URL}/api/opportunities/${opportunityId}/important-dates`, {
          headers: getAuthHeaders()
        });
        
        if (datesResponse.data.success) {
          setImportantDates(datesResponse.data.data || []);
        }
      }

      // Fetch won details (if in Won stage)
      const wonResponse = await axios.get(`${API_BASE_URL}/api/opportunities/${opportunityId}/won-details`, {
        headers: getAuthHeaders()
      });
      
      if (wonResponse.data.success) {
        setWonDetails(wonResponse.data.data);
      }

      // Fetch order analysis
      const analysisResponse = await axios.get(`${API_BASE_URL}/api/opportunities/${opportunityId}/order-analysis`, {
        headers: getAuthHeaders()
      });
      
      if (analysisResponse.data.success) {
        setOrderAnalysis(analysisResponse.data.data);
      }
    } catch (error) {
      console.error('Error fetching advanced features data:', error);
    }
  };

  // Fetch master data
  const fetchMasterData = async () => {
    try {
      const endpoints = [
        'leads?status=approved',
        'companies',
        'users/active',
        'master/currencies',
        'master/document-types'
      ];

      const responses = await Promise.all(
        endpoints.map(endpoint =>
          axios.get(`${API_BASE_URL}/api/${endpoint}`, {
            headers: getAuthHeaders()
          }).catch(err => ({ data: { success: false, data: [] } }))
        )
      );

      const [
        leadsRes,
        companiesRes,
        usersRes,
        currenciesRes,
        docTypesRes
      ] = responses;

      const allLeads = leadsRes.data.success ? leadsRes.data.data : [];
      const approvedLeads = allLeads.filter(lead => 
        lead.approval_status === 'approved' && 
        !opportunities.some(opp => opp.lead_id === lead.id)
      );

      setMasterData({
        approvedLeads,
        companies: companiesRes.data.success ? companiesRes.data.data : [],
        users: usersRes.data.success ? usersRes.data.data : [],
        currencies: currenciesRes.data.success ? currenciesRes.data.data : [],
        documentTypes: docTypesRes.data.success ? docTypesRes.data.data : []
      });
    } catch (error) {
      console.error('Error fetching master data:', error);
      toast.error('Failed to fetch master data');
    }
  };

  // Enhanced statistics calculation using analytics data
  const fetchStatistics = () => {
    const totalOpportunities = opportunities.length;
    const openOpportunities = opportunities.filter(opp => opp.state === 'Open').length;
    const tenderOpportunities = opportunities.filter(opp => opp.opportunity_type === 'Tender').length;
    const nonTenderOpportunities = opportunities.filter(opp => opp.opportunity_type === 'Non-Tender').length;
    const currentDate = new Date();
    const thisMonth = opportunities.filter(opp => {
      const oppDate = new Date(opp.created_at);
      return oppDate.getMonth() === currentDate.getMonth() && 
             oppDate.getFullYear() === currentDate.getFullYear();
    }).length;

    // Enhanced with analytics data
    const winRate = analytics?.win_rate || 0;
    const averageDealSize = analytics?.average_deal_size || 0;
    const averageSalesCycle = analytics?.average_sales_cycle || 0;
    const qualificationRate = analytics?.qualification_completion_rate || 0;
    const totalPipelineValue = analytics?.total_pipeline_value || 0;

    setStatistics({
      totalOpportunities,
      openOpportunities,
      tenderOpportunities,
      nonTenderOpportunities,
      thisMonth,
      winRate,
      averageDealSize,
      averageSalesCycle,
      qualificationRate,
      totalPipelineValue
    });
  };

  // Update statistics when opportunities or analytics change
  useEffect(() => {
    fetchStatistics();
  }, [opportunities, analytics]);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setOpportunityFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'lead_id' && value) {
      const selectedLead = masterData.approvedLeads.find(lead => lead.id === value);
      if (selectedLead) {
        setOpportunityFormData(prev => ({
          ...prev,
          opportunity_title: selectedLead.project_title || '',
          company_id: selectedLead.company_id || '',
          opportunity_owner_id: selectedLead.assigned_to_user_id || '',
          opportunity_type: selectedLead.lead_subtype_name === 'Tender' || selectedLead.lead_subtype_name === 'Pretender' ? 'Tender' : 'Non-Tender'
        }));
      }
    }
    
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!opportunityFormData.lead_id) {
      errors.lead_id = 'Lead selection is required';
    }
    if (!opportunityFormData.opportunity_title.trim()) {
      errors.opportunity_title = 'Opportunity title is required';
    }
    if (!opportunityFormData.opportunity_type) {
      errors.opportunity_type = 'Opportunity type is required';
    }
    if (!opportunityFormData.company_id) {
      errors.company_id = 'Company is required';
    }
    if (!opportunityFormData.opportunity_owner_id) {
      errors.opportunity_owner_id = 'Opportunity owner is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Reset form
  const resetForm = () => {
    setOpportunityFormData({
      lead_id: '',
      opportunity_title: '',
      opportunity_type: '',
      company_id: '',
      opportunity_owner_id: '',
      partner_id: '',
      expected_closure_date: '',
      remarks: ''
    });
    setValidationErrors({});
  };

  // Handle create opportunity
  const handleCreateOpportunity = async () => {
    if (!validateForm()) {
      toast.error('Please fix validation errors');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/api/opportunities`, opportunityFormData, {
        headers: getAuthHeaders()
      });

      if (response.data.success) {
        toast.success('Opportunity created successfully');
        setShowCreateDialog(false);
        resetForm();
        fetchOpportunities();
        fetchMasterData();
        fetchAnalytics(); // Refresh analytics
        fetchKPIs(); // Refresh KPIs
      }
    } catch (error) {
      console.error('Error creating opportunity:', error);
      toast.error(error.response?.data?.detail || 'Failed to create opportunity');
    } finally {
      setLoading(false);
    }
  };

  // Handle manual auto-conversion
  const handleAutoConversion = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/api/opportunities/auto-convert`, {}, {
        headers: getAuthHeaders()
      });

      if (response.data.success) {
        const convertedCount = response.data.data?.converted_count || 0;
        toast.success(`Auto-conversion completed. ${convertedCount} leads converted to opportunities.`);
        fetchOpportunities();
        fetchMasterData();
        fetchAnalytics();
      }
    } catch (error) {
      console.error('Error in auto-conversion:', error);
      toast.error(error.response?.data?.detail || 'Failed to perform auto-conversion');
    } finally {
      setLoading(false);
    }
  };

  // Handle view opportunity (enhanced with all phases data)
  const handleViewOpportunity = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setActiveTab('overview');
    setShowViewDialog(true);
    
    // Fetch all related data for phases 2 & 3
    fetchQualificationData(opportunity.id);
    fetchAdvancedFeaturesData(opportunity.id);
  };

  // Get performance status color
  const getPerformanceStatusColor = (status) => {
    switch (status) {
      case 'exceeded': return 'text-green-600';
      case 'on_track': return 'text-blue-600';
      case 'at_risk': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Get performance status icon
  const getPerformanceStatusIcon = (status) => {
    switch (status) {
      case 'exceeded': return <ArrowUp className="h-4 w-4" />;
      case 'on_track': return <Minus className="h-4 w-4" />;
      case 'at_risk': return <AlertTriangle className="h-4 w-4" />;
      case 'critical': return <ArrowDown className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  // Filter opportunities based on search term
  const filteredOpportunities = opportunities.filter(opp =>
    opp.opportunity_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.opportunity_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // DataTable columns configuration (enhanced)
  const columns = [
    {
      key: 'opportunity_id',
      label: 'Opportunity ID',
      sortable: true,
      render: (value) => (
        <Badge variant="outline" className="font-mono">
          {value}
        </Badge>
      )
    },
    {
      key: 'sr_no',
      label: 'SR No.',
      sortable: true,
      render: (value) => (
        <span className="font-medium">#{value}</span>
      )
    },
    {
      key: 'opportunity_title',
      label: 'Opportunity Title',
      sortable: true,
      render: (value) => (
        <div className="font-medium max-w-xs truncate" title={value}>
          {value}
        </div>
      )
    },
    {
      key: 'company_name',
      label: 'Company',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-muted-foreground" />
          {value}
        </div>
      )
    },
    {
      key: 'opportunity_type',
      label: 'Type',
      sortable: true,
      render: (value) => (
        <Badge variant={value === 'Tender' ? 'default' : 'secondary'}>
          {value}
        </Badge>
      )
    },
    {
      key: 'current_stage_name',
      label: 'Current Stage',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground">{row.current_stage_code}</span>
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'expected_revenue',
      label: 'Expected Revenue',
      sortable: true,
      render: (value, row) => (
        value ? (
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {row.currency_symbol || '₹'} {parseFloat(value).toLocaleString()}
            </span>
          </div>
        ) : '-'
      )
    },
    {
      key: 'state',
      label: 'State',
      sortable: true,
      render: (value) => (
        <Badge variant={value === 'Open' ? 'default' : 'secondary'}>
          {value}
        </Badge>
      )
    },
    {
      key: 'owner_name',
      label: 'Owner',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          {value}
        </div>
      )
    },
    {
      key: 'linked_lead_id',
      label: 'Linked Lead',
      sortable: true,
      render: (value) => (
        value ? (
          <div className="flex items-center gap-1">
            <Link className="h-4 w-4 text-muted-foreground" />
            <Badge variant="outline" className="font-mono text-xs">
              {value}
            </Badge>
          </div>
        ) : '-'
      )
    },
    {
      key: 'created_at',
      label: 'Created',
      sortable: true,
      render: (value) => (
        <div className="text-sm text-muted-foreground">
          {new Date(value).toLocaleDateString()}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewOpportunity(row)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          
          <ProtectedComponent 
            requiredPermission="edit" 
            requiredResource="/opportunities"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                toast.info('Edit functionality available in comprehensive view dialog');
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </ProtectedComponent>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Opportunity Management</h2>
          <p className="text-muted-foreground">
            Manage sales opportunities from approved leads with comprehensive workflow tracking
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ProtectedComponent 
            requiredPermission="create" 
            requiredResource="/opportunities"
          >
            <Button
              variant="outline"
              onClick={handleAutoConversion}
              disabled={loading}
            >
              <Zap className="h-4 w-4 mr-2" />
              Auto-Convert Leads
            </Button>
          </ProtectedComponent>
          
          <ProtectedComponent 
            requiredPermission="create" 
            requiredResource="/opportunities"
          >
            <Button
              onClick={() => {
                resetForm();
                setShowCreateDialog(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Opportunity
            </Button>
          </ProtectedComponent>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Opportunities</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalOpportunities}</div>
            <p className="text-xs text-muted-foreground">
              All opportunities in system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Opportunities</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.openOpportunities}</div>
            <p className="text-xs text-muted-foreground">
              Currently in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tender Opportunities</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.tenderOpportunities}</div>
            <p className="text-xs text-muted-foreground">
              Tender-based opportunities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Non-Tender</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.nonTenderOpportunities}</div>
            <p className="text-xs text-muted-foreground">
              Direct sales opportunities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.thisMonth}</div>
            <p className="text-xs text-muted-foreground">
              New opportunities
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search opportunities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-[300px]"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchOpportunities}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <DataTable
            data={filteredOpportunities}
            columns={columns}
            loading={loading}
            searchable={false} // We handle search externally
          />
        </CardContent>
      </Card>

      {/* Create Opportunity Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Create New Opportunity from Approved Lead
            </DialogTitle>
            <DialogDescription>
              Create an opportunity from an approved lead. The system will auto-populate relevant information.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Lead Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Select Approved Lead</CardTitle>
                <CardDescription>
                  Choose from approved leads that don't have existing opportunities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>
                    Approved Lead <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={opportunityFormData.lead_id}
                    onValueChange={(value) => handleInputChange('lead_id', value)}
                  >
                    <SelectTrigger className={validationErrors.lead_id ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select an approved lead" />
                    </SelectTrigger>
                    <SelectContent>
                      {masterData.approvedLeads.length === 0 ? (
                        <SelectItem value="no-leads" disabled>
                          No approved leads available
                        </SelectItem>
                      ) : (
                        masterData.approvedLeads.map((lead) => (
                          <SelectItem key={lead.id} value={lead.id}>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="font-mono text-xs">
                                {lead.lead_id}
                              </Badge>
                              <span>{lead.project_title}</span>
                              <span className="text-muted-foreground">({lead.company_name})</span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {validationErrors.lead_id && (
                    <p className="text-sm text-red-500">{validationErrors.lead_id}</p>
                  )}
                  {masterData.approvedLeads.length === 0 && (
                    <div className="flex items-center text-amber-600 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      No approved leads available for opportunity creation
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Opportunity Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Opportunity Details</CardTitle>
                <CardDescription>
                  Information will be auto-populated from the selected lead
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>
                      Opportunity Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={opportunityFormData.opportunity_title}
                      onChange={(e) => handleInputChange('opportunity_title', e.target.value)}
                      placeholder="Enter opportunity title"
                      className={validationErrors.opportunity_title ? 'border-red-500' : ''}
                    />
                    {validationErrors.opportunity_title && (
                      <p className="text-sm text-red-500">{validationErrors.opportunity_title}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Opportunity Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={opportunityFormData.opportunity_type}
                      onValueChange={(value) => handleInputChange('opportunity_type', value)}
                    >
                      <SelectTrigger className={validationErrors.opportunity_type ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select opportunity type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tender">Tender</SelectItem>
                        <SelectItem value="Non-Tender">Non-Tender</SelectItem>
                      </SelectContent>
                    </Select>
                    {validationErrors.opportunity_type && (
                      <p className="text-sm text-red-500">{validationErrors.opportunity_type}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Company <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={opportunityFormData.company_id}
                      onValueChange={(value) => handleInputChange('company_id', value)}
                      disabled={!opportunityFormData.lead_id}
                    >
                      <SelectTrigger className={validationErrors.company_id ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select company" />
                      </SelectTrigger>
                      <SelectContent>
                        {masterData.companies.map((company) => (
                          <SelectItem key={company.company_id} value={company.company_id}>
                            {company.company_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {validationErrors.company_id && (
                      <p className="text-sm text-red-500">{validationErrors.company_id}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Opportunity Owner <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={opportunityFormData.opportunity_owner_id}
                      onValueChange={(value) => handleInputChange('opportunity_owner_id', value)}
                    >
                      <SelectTrigger className={validationErrors.opportunity_owner_id ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select opportunity owner" />
                      </SelectTrigger>
                      <SelectContent>
                        {masterData.users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} ({user.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {validationErrors.opportunity_owner_id && (
                      <p className="text-sm text-red-500">{validationErrors.opportunity_owner_id}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Expected Closure Date</Label>
                    <Input
                      type="date"
                      value={opportunityFormData.expected_closure_date}
                      onChange={(e) => handleInputChange('expected_closure_date', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Remarks</Label>
                  <Textarea
                    value={opportunityFormData.remarks}
                    onChange={(e) => handleInputChange('remarks', e.target.value)}
                    placeholder="Enter any additional remarks..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center justify-end gap-2 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateOpportunity} disabled={loading}>
              {loading ? 'Creating...' : 'Create Opportunity'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Opportunity Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Opportunity Details</DialogTitle>
            <DialogDescription>
              Comprehensive opportunity information and linked lead details
            </DialogDescription>
          </DialogHeader>

          {selectedOpportunity && (
            <div className="space-y-6">
              {/* Opportunity Summary */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono">
                          {selectedOpportunity.opportunity_id}
                        </Badge>
                        {selectedOpportunity.opportunity_title}
                      </CardTitle>
                      <CardDescription>
                        {selectedOpportunity.company_name} • {selectedOpportunity.opportunity_type}
                        {selectedOpportunity.auto_converted && (
                          <Badge variant="secondary" className="ml-2">Auto-Converted</Badge>
                        )}
                      </CardDescription>
                    </div>
                    <Badge variant={selectedOpportunity.state === 'Open' ? 'default' : 'secondary'}>
                      {selectedOpportunity.state}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Serial Number</Label>
                      <div className="font-medium">#{selectedOpportunity.sr_no}</div>
                    </div>
                    
                    <div>
                      <Label className="text-sm text-muted-foreground">Current Stage</Label>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">{selectedOpportunity.current_stage_code}</span>
                        <span className="font-medium">{selectedOpportunity.current_stage_name}</span>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm text-muted-foreground">Owner</Label>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedOpportunity.owner_name}</span>
                      </div>
                    </div>
                    
                    {selectedOpportunity.expected_revenue && (
                      <div>
                        <Label className="text-sm text-muted-foreground">Expected Revenue</Label>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {selectedOpportunity.currency_symbol || '₹'} {parseFloat(selectedOpportunity.expected_revenue).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <Label className="text-sm text-muted-foreground">Created</Label>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(selectedOpportunity.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    {selectedOpportunity.linked_lead_id && (
                      <div>
                        <Label className="text-sm text-muted-foreground">Linked Lead</Label>
                        <div className="flex items-center gap-1">
                          <Link className="h-4 w-4 text-muted-foreground" />
                          <Badge variant="outline" className="font-mono text-xs">
                            {selectedOpportunity.linked_lead_id}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {selectedOpportunity.project_description && (
                    <div className="mt-4">
                      <Label className="text-sm text-muted-foreground">Project Description</Label>
                      <p className="mt-1 text-sm">{selectedOpportunity.project_description}</p>
                    </div>
                  )}
                  
                  {selectedOpportunity.remarks && (
                    <div className="mt-4">
                      <Label className="text-sm text-muted-foreground">Remarks</Label>
                      <p className="mt-1 text-sm">{selectedOpportunity.remarks}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="text-center py-4 text-muted-foreground">
                <p className="text-sm">Additional opportunity details (contacts, documents, stage history) will be available in Phase 2.</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OpportunityManagement;