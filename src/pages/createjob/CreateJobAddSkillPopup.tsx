import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState, useMemo } from "react";
import SkillDetailPopup from "./SkillDetailPopup";
import type {
  CreateJobAddSkillPopupProps,
  Skill,
} from "@/types/createJobTypes";

const AVAILABLE_SKILLS: Skill[] = [
  {
    id: "react",
    name: "React",
    category: "Computer, Technology",
    description:
      "At Western Digital, our vision is to power global innovation and push the boundaries of technology to make what you thought was once impossible, possible.\n\nAt our core, Western Digital is a company of problem solvers. People achieve extraordinary things given the right technology. For decades, we've been doing just that—our technology helped people put a man on the moon and capture the first-ever picture of a black hole.",
    preSkills: ["React", "TypeScript", "Figma"],
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "Computer, Technology",
    description:
      "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. It is maintained by Microsoft and it is open source.\n\nTypeScript adds optional static typing to JavaScript. Large apps written in JavaScript are hard to understand and difficult to maintain. With the help of types, it is easier to document the intent of code.",
    preSkills: ["JavaScript", "OOP"],
  },
  {
    id: "figma",
    name: "Figma",
    category: "Design, UI/UX",
    description:
      "Figma is a vector graphics editor and prototyping tool which is primarily web-based, with additional offline features enabled by desktop applications for macOS and Windows.\n\nFigma is used for user interface and user experience design, as well as prototyping. The tool is free and subscription-based, and it is online-based software.",
    preSkills: ["UI Design", "Prototyping"],
  },
];

export default function CreateJobAddSkillPopup({
  open,
  onOpenChange,
  searchValue,
  onSearchChange,
  onSubmit,
}: CreateJobAddSkillPopupProps) {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [selectedPreSkill, setSelectedPreSkill] = useState<Skill | null>(null);

  const getSkillByName = (skillName: string): Skill | undefined => {
    return AVAILABLE_SKILLS.find(
      (skill) => skill.name.toLowerCase() === skillName.toLowerCase(),
    );
  };

  const handlePreSkillClick = (preSkillName: string) => {
    const skill = getSkillByName(preSkillName);
    if (skill) {
      setSelectedPreSkill(skill);
    }
  };

  const filteredSkills = useMemo(() => {
    if (!searchValue.trim()) return [];
    return AVAILABLE_SKILLS.filter((skill) =>
      skill.name.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }, [searchValue]);

  const handleSelectSkill = (skill: Skill) => {
    setSelectedSkill(skill);
  };

  const handleAddSkill = () => {
    if (!selectedSkill) return;
    onSubmit(selectedSkill.name);
    onSearchChange("");
    setSelectedSkill(null);
    onOpenChange(false);
  };

  const handleBack = () => {
    setSelectedSkill(null);
    onSearchChange("");
  };

  const handleClosePopup = () => {
    setSelectedSkill(null);
    setSelectedPreSkill(null);
    onSearchChange("");
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open && !selectedSkill} onOpenChange={handleClosePopup}>
        <DialogContent className="w-[90vw]! max-w-130! rounded-2xl p-0! overflow-hidden gap-0!">
          <div className="relative p-5 sm:p-6">
            <button
              type="button"
              aria-label="Close"
              onClick={handleClosePopup}
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
                  onChange={(event) => onSearchChange(event.target.value)}
                  placeholder="React..."
                  autoFocus
                />
              </div>

              {searchValue.trim() && filteredSkills.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Suggestions:</p>
                  <div className="flex flex-wrap gap-2">
                    {filteredSkills.map((skill) => (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() => handleSelectSkill(skill)}
                        className="rounded-full border border-primary/40 px-4 py-2 text-sm text-primary hover:bg-primary/5 transition-colors"
                      >
                        {skill.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {searchValue.trim() && filteredSkills.length === 0 && (
                <p className="text-sm text-muted-foreground">No skills found</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={open && !!selectedSkill} onOpenChange={handleClosePopup}>
        <DialogContent className="w-[90vw]! max-w-130! rounded-2xl p-0! overflow-hidden gap-0!">
          <div className="relative p-5 sm:p-6 max-h-[80vh] overflow-y-auto">
            <button
              type="button"
              aria-label="Close"
              onClick={handleClosePopup}
              className="absolute right-4 top-4 rounded-full p-1 text-foreground hover:bg-muted z-10"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-4">
              <div className="pr-8">
                <h3 className="text-[34px] leading-none font-medium gradient-text">
                  {selectedSkill?.name}
                </h3>
              </div>

              <div>
                <p className="text-lg font-medium">Category</p>
                <p className="text-muted-foreground text-base">
                  {selectedSkill?.category}
                </p>
              </div>

              <div>
                <p className="mb-2 text-lg font-medium">Pre-Skill</p>
                <div className="flex flex-wrap gap-2">
                  {selectedSkill?.preSkills.map((preSkill, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handlePreSkillClick(preSkill)}
                      className={`rounded-full border px-4 py-1 text-sm transition-colors hover:opacity-80 cursor-pointer ${
                        preSkill === "React"
                          ? "border-primary/40 text-primary"
                          : "border-muted-foreground/30 bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {preSkill}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-lg font-medium">Skill Description</p>
                <div className="space-y-2 text-base font-normal leading-relaxed text-foreground">
                  {selectedSkill?.description
                    .split("\n\n")
                    .map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={handleAddSkill}
                  className="flex-1 text-white"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  + Add This Skill
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {selectedPreSkill && (
        <SkillDetailPopup
          open={!!selectedPreSkill}
          onOpenChange={(isOpen) => {
            if (!isOpen) setSelectedPreSkill(null);
          }}
          skillName={selectedPreSkill?.name || ""}
          category={selectedPreSkill?.category || ""}
          description={selectedPreSkill?.description || ""}
          preSkills={selectedPreSkill?.preSkills || []}
        />
      )}
    </>
  );
}
