import { useEffect, useMemo, useState } from "react";
import { FolderPlus } from "lucide-react";
import { toast } from "react-hot-toast";
import projectApi from "../api/projectApi";
import ttsApi from "../api/ttsApi";
import ProjectCard from "../components/ProjectCard";
import LoadingButton from "../components/LoadingButton";
import { getErrorMessage } from "../utils/errorMessage";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [history, setHistory] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const voiceCountByProject = useMemo(() => {
    const counts = {};

    for (const item of history) {
      const projectId = item?.projectId?._id || item?.projectId;
      if (!projectId) {
        continue;
      }
      counts[projectId] = (counts[projectId] || 0) + 1;
    }

    return counts;
  }, [history]);

  const fetchData = async () => {
    const [projectResponse, historyResponse] = await Promise.all([projectApi.getAll(), ttsApi.getHistory()]);
    setProjects(projectResponse.data.projects || []);
    setHistory(historyResponse.data.history || []);
  };

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        await fetchData();
      } catch (error) {
        toast.error(getErrorMessage(error, "Khong the tai danh sach project"));
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();
    setIsCreating(true);

    try {
      await projectApi.create({ name: projectName || "Project dau tien" });
      setProjectName("");
      toast.success("Da tao project moi");
      await fetchData();
    } catch (error) {
      toast.error(getErrorMessage(error, "Tao project that bai"));
    } finally {
      setIsCreating(false);
    }
  };

  const handleRename = async (project) => {
    const newName = window.prompt("Nhap ten moi cho project", project.name);

    if (!newName || !newName.trim()) {
      return;
    }

    try {
      await projectApi.update(project._id, { name: newName.trim() });
      toast.success("Da doi ten project");
      await fetchData();
    } catch (error) {
      toast.error(getErrorMessage(error, "Doi ten that bai"));
    }
  };

  const handleDelete = async (project) => {
    if (!window.confirm(`Xoa project ${project.name}?`)) {
      return;
    }

    try {
      await projectApi.remove(project._id);
      toast.success("Da xoa project");
      await fetchData();
    } catch (error) {
      toast.error(getErrorMessage(error, "Xoa project that bai"));
    }
  };

  return (
    <div className="space-y-6 animate-fadeUp">
      <section className="surface-card p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h3 className="text-2xl font-extrabold text-ink">Du an cua ban</h3>
            <p className="text-sm text-muted mt-1">Tao va quan ly cac du an giong doc AI cua ban</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
            <FolderPlus size={14} />
            {projects.length} projects
          </span>
        </div>

        <form onSubmit={handleCreate} className="mt-4 flex flex-col md:flex-row gap-2">
          <input
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
            placeholder="Nhap ten du an moi"
            className="w-full rounded-xl border border-borderSoft px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-50"
          />
          <LoadingButton loading={isCreating} loadingText="Dang tao..." type="submit" className="md:min-w-[180px]">
            Tao du an moi
          </LoadingButton>
        </form>
      </section>

      {isLoading ? (
        <div className="glass-card rounded-2xl p-5 text-sm text-muted">Dang tai projects...</div>
      ) : projects.length === 0 ? (
        <div className="surface-card p-8 text-center">
          <h4 className="text-lg font-bold text-ink">Chua co project nao</h4>
          <p className="text-sm text-muted mt-1">Hay tao nhanh project dau tien de bat dau tao voice.</p>
          <LoadingButton
            type="button"
            className="mt-4"
            onClick={async () => {
              setIsCreating(true);
              try {
                await projectApi.create({ name: "Project dau tien" });
                toast.success("Da tao Project dau tien");
                await fetchData();
              } catch (error) {
                toast.error(getErrorMessage(error, "Tao project that bai"));
              } finally {
                setIsCreating(false);
              }
            }}
            loading={isCreating}
            loadingText="Dang tao..."
          >
            Tao nhanh Project dau tien
          </LoadingButton>
        </div>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              voiceCount={voiceCountByProject[project._id] || 0}
              onRename={handleRename}
              onDelete={handleDelete}
            />
          ))}
        </section>
      )}
    </div>
  );
};

export default Projects;
