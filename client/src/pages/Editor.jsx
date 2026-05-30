import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { MicVocal } from "lucide-react";
import projectApi from "../api/projectApi";
import ttsApi from "../api/ttsApi";
import TextEditor from "../components/TextEditor";
import VoiceSelector from "../components/VoiceSelector";
import SpeedSelector from "../components/SpeedSelector";
import PauseSelector from "../components/PauseSelector";
import AudioPlayer from "../components/AudioPlayer";
import LoadingButton from "../components/LoadingButton";
import CreditBadge from "../components/CreditBadge";
import useAuthStore from "../store/authStore";
import { getErrorMessage } from "../utils/errorMessage";

const Editor = () => {
  const { projectId } = useParams();
  const setCredits = useAuthStore((state) => state.setCredits);

  const [projectName, setProjectName] = useState("Project");
  const [voices, setVoices] = useState([]);
  const [voice, setVoice] = useState("adam-3");
  const [speed, setSpeed] = useState(1);
  const [pause, setPause] = useState(100);
  const [text, setText] = useState("");
  const [showSentences, setShowSentences] = useState(false);
  const [audioResult, setAudioResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const sentenceCount = useMemo(() => {
    const cleaned = text.trim();
    if (!cleaned) {
      return 0;
    }
    return cleaned.split(/(?<=[.!?])\s+/).filter(Boolean).length;
  }, [text]);

  useEffect(() => {
    const fetchBootstrap = async () => {
      setIsLoading(true);
      try {
        const [projectResponse, voicesResponse] = await Promise.all([
          projectApi.getById(projectId),
          ttsApi.getVoices()
        ]);

        setProjectName(projectResponse.data.project?.name || "Project");

        const voiceList = voicesResponse.data.voices || [];
        setVoices(voiceList);

        const preferred = voiceList.find((item) => item.id === "adam-3") || voiceList[0];
        if (preferred) {
          setVoice(preferred.id);
        }
      } catch (error) {
        toast.error(getErrorMessage(error, "Khong the tai du lieu editor"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchBootstrap();
  }, [projectId]);

  const generateVoice = async () => {
    if (!text.trim()) {
      toast.error("Text khong duoc rong");
      return;
    }

    setIsGenerating(true);

    try {
      const { data } = await ttsApi.generate({
        projectId,
        text,
        voice,
        speed,
        pause
      });

      const resolvedAudioUrl = data?.audio?.audioUrl || data?.history?.audioUrl || data?.audioUrl || "";
      if (!resolvedAudioUrl) {
        throw new Error("Khong the phat audio. Hay mo link audio de kiem tra backend.");
      }

      console.log("TTS generate response:", {
        audioUrl: resolvedAudioUrl,
        characterCount: data?.history?.characterCount ?? data?.characterCount ?? text.length,
        creditUsed: data?.history?.creditUsed ?? data?.creditUsed ?? text.length,
        historyId: data?.history?.id ?? data?.historyId ?? null
      });

      setAudioResult({
        audioUrl: resolvedAudioUrl,
        voice,
        characterCount: data?.history?.characterCount ?? data?.characterCount ?? text.length,
        creditUsed: data?.history?.creditUsed ?? data?.creditUsed ?? text.length,
        createdAt: data?.history?.createdAt || new Date().toISOString()
      });

      const nextCredits = data?.user?.credits ?? data?.remainingCredits;
      if (typeof nextCredits === "number" && !Number.isNaN(nextCredits)) {
        setCredits(nextCredits);
      }
      toast.success("Tao voice thanh cong");
    } catch (error) {
      toast.error(getErrorMessage(error, "Tao voice that bai"));
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return <div className="glass-card rounded-2xl p-5 text-sm text-muted">Dang tai editor...</div>;
  }

  return (
    <div className="space-y-6 animate-fadeUp">
      <section className="surface-card p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Project</p>
            <h3 className="text-2xl font-extrabold text-ink">{projectName}</h3>
            <p className="text-sm text-muted mt-1">Soan thao - Cai dat - Tao voice</p>
          </div>
          <div className="flex items-center gap-2">
            <CreditBadge />
            <LoadingButton
              type="button"
              onClick={generateVoice}
              loading={isGenerating}
              loadingText="Dang tao voice..."
              className="min-w-[140px]"
            >
              Tao voice
            </LoadingButton>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <TextEditor
          value={text}
          onChange={setText}
          showSentences={showSentences}
          onToggleSentences={() => setShowSentences((prev) => !prev)}
        />

        <div className="surface-card p-5 space-y-4 h-fit">
          <div className="flex items-center gap-2">
            <MicVocal className="text-brand-600" size={18} />
            <h4 className="text-base font-bold text-ink">Voice settings</h4>
          </div>

          <VoiceSelector voices={voices} value={voice} onChange={setVoice} />
          <SpeedSelector value={speed} onChange={setSpeed} />
          <PauseSelector value={pause} onChange={setPause} />

          <div className="rounded-xl bg-slate-50 p-3 text-xs text-muted">
            <p>Output format: MP3</p>
            <p className="mt-1">Ky tu: {text.length.toLocaleString()} - Cau: {sentenceCount}</p>
          </div>

          <LoadingButton
            type="button"
            onClick={generateVoice}
            loading={isGenerating}
            loadingText="Dang tao voice..."
            className="w-full"
          >
            Doc lai / Generate Voice
          </LoadingButton>
        </div>
      </section>

      <AudioPlayer
        audioUrl={audioResult?.audioUrl}
        voice={audioResult?.voice}
        characterCount={audioResult?.characterCount}
        creditUsed={audioResult?.creditUsed}
        createdAt={audioResult?.createdAt}
      />
    </div>
  );
};

export default Editor;
