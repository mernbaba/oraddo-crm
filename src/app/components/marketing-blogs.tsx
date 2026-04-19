import { FileText, Plus, Eye, ThumbsUp, MessageCircle, Share2, Search, Filter, Sparkles, Code2, Copy, Check, Image as ImageIcon, X, Loader2, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Modal } from "./ui/modal";
import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { marketingService, BlogData } from "../services/marketingService";

export function MarketingBlogs() {
  const [integrateModalOpen, setIntegrateModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewPostModalOpen, setViewPostModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<BlogData | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);

  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [orgId, setOrgId] = useState<number | null>(null);
  const [blogList, setBlogList] = useState<BlogData[]>([]);

  // Form states
  const [formData, setFormData] = useState<Partial<BlogData>>({
    title: "",
    description: "",
    publishDate: new Date().toISOString().split('T')[0],
    name: "",
    CompanyName: "",
    imageUrl: "",
  });

  useEffect(() => {
    const data = sessionStorage.getItem("userData");
    if (data) {
      const parsedUser = JSON.parse(data);
      if (parsedUser.organizationId) {
        setOrgId(Number(parsedUser.organizationId));
      }
    }
  }, []);

  useEffect(() => {
    if (orgId) {
      fetchBlogs();
    }
  }, [orgId]);

  const fetchBlogs = async () => {
    if (!orgId) return;
    setLoading(true);
    try {
      const res = await marketingService.getBlogs(orgId);
      setBlogList(res.data || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgId) return;
    setIsSaving(true);
    try {
      await marketingService.createBlog({ ...formData, organizationID: orgId });
      alert("Blog post created successfully! 📝");
      setCreateModalOpen(false);
      resetForm();
      fetchBlogs();
    } catch (error) {
      console.error("Error creating blog:", error);
      alert("Failed to create blog post.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBlog) return;
    setIsSaving(true);
    try {
      await marketingService.updateBlog(selectedBlog.id, formData);
      alert("Blog post updated successfully! ✨");
      setEditModalOpen(false);
      fetchBlogs();
    } catch (error) {
      console.error("Error updating blog:", error);
      alert("Failed to update blog post.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBlog = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) return;
    try {
      await marketingService.deleteBlog(id);
      alert("Blog post deleted! 🗑️");
      fetchBlogs();
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog post.");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      publishDate: new Date().toISOString().split('T')[0],
      name: "",
      CompanyName: "",
      imageUrl: "",
    });
  };

  const handleOpenEdit = (blog: BlogData) => {
    setSelectedBlog(blog);
    setFormData({ ...blog });
    setEditModalOpen(true);
  };

  const handleViewBlog = async (blog: BlogData) => {
    setSelectedBlog(blog);
    setViewPostModalOpen(true);
    try {
      await marketingService.incrementBlogViews(blog.id);
      setBlogList(prev => prev.map(b => b.id === blog.id ? { ...b, views: (b.views || 0) + 1 } : b));
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  };

  const integrationCode = `<!-- Blog Widget Integration -->
<script src="https://yourdomain.com/blog-widget.js"></script>
<div id="blog-widget" data-api-key="YOUR_API_KEY"></div>
<script>
  BlogWidget.init({
    containerId: 'blog-widget',
    apiKey: 'YOUR_API_KEY',
    theme: 'purple',
    postsPerPage: 6,
    showCategories: true,
    showSearch: true
  });
</script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(integrationCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const getStats = () => {
    const total = blogList.length;
    let totalViews = 0;
    blogList.forEach(b => totalViews += (b.views || 0));
    
    const viewsDisplay = totalViews >= 1000000 ? (totalViews/1000000).toFixed(1) + "M" : totalViews >= 1000 ? (totalViews/1000).toFixed(1) + "K" : totalViews.toString();

    return [
      { label: "Total Posts", value: total.toString(), change: total > 0 ? "+12" : "0", gradient: "from-[#422462] to-[#5A4079]" },
      { label: "Total Views", value: viewsDisplay, change: total > 0 ? "+28%" : "0%", gradient: "from-[#5A4079] to-[#937CB4]" },
      { label: "Avg. Engagement", value: total > 0 ? "8.5%" : "0%", change: total > 0 ? "+3.2%" : "0%", gradient: "from-[#937CB4] to-[#5A4079]" },
      { label: "Subscribers", value: "0", change: "0", gradient: "from-[#422462] to-[#937CB4]" },
    ];
  };

  const stats = getStats();


  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published": return "bg-green-100 text-green-700 border-green-300";
      case "Draft": return "bg-gray-100 text-gray-700 border-gray-300";
      case "Scheduled": return "bg-blue-100 text-blue-700 border-blue-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <div className="space-y-6">
 
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-[#937CB4] blur-xl opacity-40 animate-pulse"></div>
            <FileText className="h-8 w-8 text-[#422462] relative z-10 animate-pulse-glow" />
          </div>
          <div>
            <h2 className="text-3xl font-bold gradient-text">Blogs</h2>
            <p className="text-[#5A4079]">Create and manage blog content</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline"
            className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]/50"
            onClick={() => setIntegrateModalOpen(true)}
          >
            <Code2 className="h-4 w-4 mr-2" />
            Integrate Website
          </Button>
          <Button className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462] shadow-lg shadow-[#937CB4]/30" onClick={() => setCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>
      </div>
 
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
            <div className="relative z-10">
              <p className="text-sm text-[#5A4079] mb-1">{stat.label}</p>
              <div className="flex items-end justify-between">
                <h3 className="text-3xl font-bold text-[#200B43]">{stat.value}</h3>
                <span className="text-sm font-medium text-green-600">{stat.change}</span>
              </div>
            </div>
            <div className="absolute top-2 right-2">
              <Sparkles className="h-5 w-5 text-[#937CB4] opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>
 
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5A4079]" />
          <input
            type="text"
            placeholder="Search blog posts..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-[#937CB4] text-[#200B43]"
          />
        </div>
        <Button variant="outline" className="border-[#937CB4]/20 text-[#422462] hover:bg-[#F0E9FF]/50">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>
 
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-20 rounded-xl">
            <Loader2 className="h-10 w-10 text-[#422462] animate-spin" />
          </div>
        )}

        {!loading && blogList.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 px-4 text-center bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-dashed border-[#937CB4]/20">
            <div className="bg-[#F0E9FF] p-4 rounded-full mb-4">
              <FileText className="h-12 w-12 text-[#5A4079] opacity-50" />
            </div>
            <h3 className="text-xl font-bold text-[#200B43] mb-2">No blog posts found</h3>
            <p className="text-[#5A4079] max-w-sm mb-6">
              You haven't written any blog posts yet. Click the button below to share your first insight with the world!
            </p>
            <Button 
              onClick={() => { resetForm(); setCreateModalOpen(true); }}
              className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Write Your First Post
            </Button>
          </div>
        )}
        
        {blogList.map((blog) => (
          <div
            key={blog.id}
            className="relative overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white/90 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
 
            <div className="relative h-48 overflow-hidden">
              <img
                src={blog.imageUrl || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop"}
                alt={blog.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#200B43]/60 to-transparent"></div>
              <div className="absolute top-4 right-4 flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 bg-white/20 backdrop-blur-md text-white hover:bg-white/40"
                  onClick={(e) => { e.stopPropagation(); handleOpenEdit(blog); }}
                >
                  <Plus className="h-4 w-4 rotate-45 scale-75" /> {/* Use as mini edit icon */}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 bg-red-500/20 backdrop-blur-md text-red-200 hover:bg-red-500/40"
                  onClick={(e) => { e.stopPropagation(); handleDeleteBlog(blog.id); }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor("Published")}`}>
                  Published
                </span>
              </div>
            </div>
 
            <div className="p-6">
              <div className="mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-[#F0E9FF] to-[#F0E9FF]/50 text-[#422462] border border-[#937CB4]/30">
                  {blog.CompanyName || "Uncategorized"}
                </span>
              </div>
 
              <h3 className="text-lg font-semibold text-[#200B43] mb-2 group-hover:text-[#422462] transition-colors">
                {blog.title}
              </h3>
              <p className="text-sm text-[#5A4079] mb-4 line-clamp-2">{blog.description}</p>
 
              <div className="flex items-center gap-2 text-xs text-[#5A4079] mb-4">
                <span className="font-medium text-[#422462]">{blog.name || "Admin"}</span>
                <span>•</span>
                <span>{blog.publishDate}</span>
              </div>
 
              <div className="flex items-center gap-4 mb-4 pt-4 border-t border-[#937CB4]/20">
                <div className="flex items-center gap-1 text-sm text-[#5A4079]">
                  <Eye className="h-4 w-4" />
                  <span>{(blog.views || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-[#5A4079]">
                  <ThumbsUp className="h-4 w-4" />
                  <span>0</span> {/* Not present in model */}
                </div>
                <div className="flex items-center gap-1 text-sm text-[#5A4079]">
                  <MessageCircle className="h-4 w-4" />
                  <span>0</span> {/* Not present in model */}
                </div>
              </div>
 
              <div className="flex items-center gap-2">
                <Button size="sm" className="flex-1 bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462]" onClick={() => handleViewBlog(blog)}>
                  View Post
                </Button>
                <Button size="sm" variant="outline" className="border-[#937CB4]/20 text-[#422462] hover:bg-[#F0E9FF]/50">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>

            </div>
          </div>
        ))}
      </div>
 
      <Modal isOpen={integrateModalOpen} onClose={() => setIntegrateModalOpen(false)} title="Integrate Blog Widget" size="lg">
        <div className="space-y-6">
   
          <div className="p-4 rounded-lg bg-[#F0E9FF]/30 border border-[#937CB4]/20">
            <h3 className="text-sm font-semibold text-[#422462] mb-3">Integration Instructions</h3>
            <ul className="space-y-2 text-sm text-[#5A4079]">
              <li className="flex items-start gap-2">
                <span className="text-[#422462] font-bold mt-0.5">•</span>
                <span>Copy the JavaScript code snippet below and paste it into your website's HTML file</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#422462] font-bold mt-0.5">•</span>
                <span>Replace <code className="bg-[#937CB4]/20 px-1.5 py-0.5 rounded text-[#422462] font-mono text-xs">YOUR_API_KEY</code> with your actual API key from Settings</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#422462] font-bold mt-0.5">•</span>
                <span>Place the code where you want the blog widget to appear on your page</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#422462] font-bold mt-0.5">•</span>
                <span>Customize the widget theme, posts per page, and display options in the configuration object</span>
              </li>
            </ul>
          </div>
 
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-[#422462]">Integration Code</h3>
              <Button
                size="sm"
                variant="outline"
                className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]/50"
                onClick={copyToClipboard}
              >
                {codeCopied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Code
                  </>
                )}
              </Button>
            </div>
            <div className="relative rounded-lg border border-[#937CB4]/20 bg-[#1A0936] p-4 overflow-x-auto">
              <pre className="text-sm text-[#F0E9FF] font-mono">
                <code>{integrationCode}</code>
              </pre>
            </div>
          </div>
 
          <div className="p-4 rounded-lg bg-white border border-[#937CB4]/20">
            <h3 className="text-sm font-semibold text-[#422462] mb-2">Need Help?</h3>
            <p className="text-sm text-[#5A4079]">
              Visit our <span className="text-[#422462] font-medium cursor-pointer hover:underline">documentation</span> for detailed integration guides, 
              customization options, and troubleshooting tips.
            </p>
          </div>
        </div>
      </Modal>
 
      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Create New Blog Post" size="lg">
        <form className="space-y-4 max-h-[70vh] overflow-y-auto pr-2" onSubmit={handleCreateBlog}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title" className="text-[#422462]">Post Title</Label>
              <Input
                id="title"
                required
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter blog post title..."
                className="border-[#937CB4]/30 focus:border-[#422462]"
              />
            </div>
            <div>
              <Label htmlFor="author" className="text-[#422462]">Author</Label>
              <Input
                id="author"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Author name..."
                className="border-[#937CB4]/30 focus:border-[#422462]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category" className="text-[#422462]">Category</Label>
              <Input
                id="category"
                value={formData.CompanyName || ""}
                onChange={(e) => setFormData({ ...formData, CompanyName: e.target.value })}
                placeholder="e.g. Technology, Marketing"
                className="border-[#937CB4]/30 focus:border-[#422462]"
              />
            </div>
            <div>
              <Label htmlFor="status" className="text-[#422462]">Status</Label>
              <select
                id="status"
                className="w-full h-9 px-3 rounded-md border border-[#937CB4]/30 bg-white text-[#200B43] focus:outline-none focus:border-[#422462] focus:ring-2 focus:ring-[#937CB4]/20"
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-[#422462]">Description / Content</Label>
            <Textarea
              id="description"
              required
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Write your blog content here..."
              className="border-[#937CB4]/30 focus:border-[#422462] min-h-32"
              rows={8}
            />
          </div>

          <div>
            <Label htmlFor="imageUrl" className="text-[#422462]">Featured Image URL</Label>
            <Input
              id="imageUrl"
              type="url"
              value={formData.imageUrl || ""}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="border-[#937CB4]/30 focus:border-[#422462]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="publishDate" className="text-[#422462]">Publish Date</Label>
              <Input
                id="publishDate"
                type="date"
                value={formData.publishDate || ""}
                onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                className="border-[#937CB4]/30 focus:border-[#422462]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#937CB4]/20">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setCreateModalOpen(false)}
              className="border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]/50"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSaving}
              className="bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462]"
            >
              {isSaving ? "Saving..." : "Create Post"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Blog Post" size="lg">
        <form className="space-y-4 max-h-[70vh] overflow-y-auto pr-2" onSubmit={handleUpdateBlog}>
          <div>
            <Label htmlFor="edit-title">Post Title</Label>
            <Input
              id="edit-title"
              value={formData.title || ""}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="border-[#937CB4]/30"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-author">Author</Label>
              <Input value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="edit-category">Category</Label>
              <Input value={formData.CompanyName || ""} onChange={(e) => setFormData({ ...formData, CompanyName: e.target.value })} />
            </div>
          </div>
          <div>
            <Label htmlFor="edit-desc">Description</Label>
            <Textarea 
              id="edit-desc"
              value={formData.description || ""} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={6}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Updating..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Modal>
 
      <Modal isOpen={viewPostModalOpen} onClose={() => setViewPostModalOpen(false)} title="Blog Post" size="lg">
        {selectedBlog && (
          <div className="space-y-6">
 
            <div className="relative h-64 -mt-4 -mx-6 mb-6 overflow-hidden">
              <img
                src={selectedBlog.imageUrl || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop"}
                alt={selectedBlog.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#200B43]/80 to-transparent"></div>
            </div>
 
            <div className="-mt-20 relative z-10 px-6">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedBlog.status || "Published")}`}>
                  {selectedBlog.status || "Published"}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-[#F0E9FF] to-[#F0E9FF]/50 text-[#422462] border border-[#937CB4]/30">
                  {selectedBlog.CompanyName || "Uncategorized"}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">
                {selectedBlog.title}
              </h1>

              <div className="flex items-center gap-3 text-sm text-white/90 mb-6">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#937CB4] to-[#422462] flex items-center justify-center text-white font-semibold">
                    {(selectedBlog.name || "A").split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium">{selectedBlog.name || "Admin"}</p>
                    <p className="text-xs text-white/70">{selectedBlog.publishDate}</p>
                  </div>
                </div>
              </div>
            </div>
 
            <div className="flex items-center gap-6 px-6 py-4 bg-[#F0E9FF]/30 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-[#5A4079]">
                <Eye className="h-5 w-5 text-[#422462]" />
                <div>
                  <p className="font-semibold text-[#200B43]">{(selectedBlog.views || 0).toLocaleString()}</p>
                  <p className="text-xs">Views</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#5A4079]">
                <ThumbsUp className="h-5 w-5 text-[#422462]" />
                <div>
                  <p className="font-semibold text-[#200B43]">0</p>
                  <p className="text-xs">Likes</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#5A4079]">
                <MessageCircle className="h-5 w-5 text-[#422462]" />
                <div>
                  <p className="font-semibold text-[#200B43]">0</p>
                  <p className="text-xs">Comments</p>
                </div>
              </div>
            </div>
 
            <div className="prose prose-purple max-w-none px-6 mt-6">
              <p className="text-lg text-[#5A4079] mb-6 leading-relaxed whitespace-pre-wrap italic">
                {selectedBlog.description}
              </p>
              
              <div className="space-y-4 text-[#200B43] leading-relaxed">
                <h2 className="text-2xl font-bold text-[#422462] mt-8 mb-4">Introduction</h2>
                <p>
                  In today's rapidly evolving digital landscape, staying ahead of the curve is more important than ever. 
                  This comprehensive guide will walk you through the essential concepts and practical strategies you need to succeed.
                </p>
                
                <h2 className="text-2xl font-bold text-[#422462] mt-8 mb-4">Key Insights</h2>
                <p>
                  Understanding the fundamentals is crucial for long-term success. Let's dive into the most important 
                  aspects that will help you achieve your goals and maximize your impact.
                </p>
                
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Leverage data-driven decision making to optimize your strategy</li>
                  <li>Build authentic connections with your target audience</li>
                  <li>Implement scalable systems for sustainable growth</li>
                  <li>Stay agile and adapt to changing market conditions</li>
                </ul>
                
                <h2 className="text-2xl font-bold text-[#422462] mt-8 mb-4">Best Practices</h2>
                <p>
                  Following industry best practices ensures you're building on a solid foundation. Here are the proven 
                  strategies that top performers use to stay ahead of the competition.
                </p>
                
                <p>
                  Remember that consistency is key. Small, incremental improvements compound over time to create 
                  remarkable results. Focus on continuous learning and optimization.
                </p>
                
                <h2 className="text-2xl font-bold text-[#422462] mt-8 mb-4">Conclusion</h2>
                <p>
                  By implementing these strategies and maintaining a commitment to excellence, you'll be well-positioned 
                  to achieve your objectives and drive meaningful results. The journey may be challenging, but the rewards 
                  are well worth the effort.
                </p>
              </div>
            </div>
 
            <div className="flex items-center gap-3 px-6 pt-6 border-t border-[#937CB4]/20 mt-8">
              <Button 
                size="sm" 
                variant="outline"
                className="flex-1 border-[#937CB4]/30 text-[#422462] hover:bg-[#F0E9FF]/50"
                onClick={() => setViewPostModalOpen(false)}
              >
                Close
              </Button>
              <Button 
                size="sm" 
                className="flex-1 bg-gradient-to-r from-[#422462] to-[#5A4079] text-white hover:from-[#5A4079] hover:to-[#422462]"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Post
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}