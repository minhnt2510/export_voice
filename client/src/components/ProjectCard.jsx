import { Link } from "react-router-dom";
import { Pencil, Trash2, MicVocal } from "lucide-react";

const ProjectCard = ({ project, voiceCount = 0, onRename, onDelete }) => {
  return (
    <div className="surface-card p-5 animate-fadeUp">
      <p className="text-xs uppercase tracking-wide text-muted">Project</p>
      <h3 className="mt-1 text-lg font-bold text-ink truncate">{project.name}</h3>
      <p className="mt-1 text-xs text-muted">Tao: {new Date(project.createdAt).toLocaleString()}</p>

      <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
        <MicVocal size={13} />
        {voiceCount} voice da tao
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          to={`/projects/${project._id}/editor`}
          className="inline-flex items-center rounded-xl bg-brand-gradient px-3 py-2 text-sm font-semibold text-white shadow-glow"
        >
          Mo trinh soan thao
        </Link>
        <button
          type="button"
          onClick={() => onRename(project)}
          className="inline-flex items-center gap-1 rounded-xl border border-borderSoft px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <Pencil size={14} />
          Sua
        </button>
        <button
          type="button"
          onClick={() => onDelete(project)}
          className="inline-flex items-center gap-1 rounded-xl border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
        >
          <Trash2 size={14} />
          Xoa
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
