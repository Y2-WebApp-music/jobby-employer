import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { apiSearchSkills } from "@/services/createjobService";
import type {
  CreateJobAddSkillPopupProps,
  SkillSearchResultItem,
  SkillRequest,
} from "@/types/createJobTypes";

export default function CreateJobAddSkillPopup({
  open,
  onOpenChange,
  onSubmit,
}: CreateJobAddSkillPopupProps) {
  const [searchValue, setSearchValue] = useState("");
  const [results, setResults] = useState<SkillSearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedSkill, setSelectedSkill] =
    useState<SkillSearchResultItem | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const trimmed = searchValue.trim();
    if (!trimmed) {
      setResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await apiSearchSkills(trimmed);
        setResults(res.data ?? []);
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 1000);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchValue]);

  const handleClose = () => {
    setSearchValue("");
    setResults([]);
    setSelectedSkill(null);
    onOpenChange(false);
  };

  const getSkillDisplayName = (skill: SkillSearchResultItem) =>
    skill.skill_name ?? skill.name ?? "";

  const handleAddSkill = () => {
    if (!selectedSkill) return;
    const skillReq: SkillRequest = {
      index: 0,
      skill_id: selectedSkill.skill_id,
      skill_name: getSkillDisplayName(selectedSkill),
    };
    onSubmit(skillReq);
    handleClose();
  };

  // Reset when closed
  useEffect(() => {
    if (!open) {
      setSearchValue("");
      setResults([]);
      setSelectedSkill(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[90vw]! max-w-130! rounded-2xl p-0! overflow-hidden gap-0!">
        <div className="relative p-5 sm:p-6">
          <button
            type="button"
            aria-label="Close"
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-full p-1 text-foreground hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="space-y-4">
            <div className="pr-8">
              <h3 className="text-[34px] leading-none font-medium gradient-text">
                Add Skill
              </h3>
              <p className="mt-2 text-xs tracking-[0.2em] text-muted-foreground">
                ~~~~~~
              </p>
            </div>

            <div>
              <label className="mb-1 block text-base font-medium">
                Search Skill
              </label>
              <Input
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  setSelectedSkill(null);
                }}
                placeholder="React..."
                autoFocus
              />
            </div>

            {isSearching && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching...
              </div>
            )}

            {!isSearching && searchValue.trim() && results.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Suggestions:</p>
                <div className="flex flex-wrap gap-2 max-h-[160px] overflow-y-auto pr-1">
                  {results.map((skill) => (
                    <button
                      key={skill.skill_id}
                      type="button"
                      onClick={() => setSelectedSkill(skill)}
                      className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                        selectedSkill?.skill_id === skill.skill_id
                          ? "bg-primary/10 border-primary text-primary"
                          : "border-primary/40 text-primary hover:bg-primary/5"
                      }`}
                    >
                      {getSkillDisplayName(skill)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!isSearching && searchValue.trim() && results.length === 0 && (
              <p className="text-sm text-muted-foreground">No skills found</p>
            )}

            {selectedSkill && (
              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  onClick={handleAddSkill}
                  className="w-full text-white"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  + Add "{getSkillDisplayName(selectedSkill)}"
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
