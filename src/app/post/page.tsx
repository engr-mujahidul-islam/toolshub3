import CopyList, { CopyItem } from "@/components/Reusable/CopyList";
import React from "react";

const postItems: CopyItem[] = [
  {
    id: "priorityPost",
    label: "Priority List Post",
    text: "Hi @all - Priority list attached below and Daily Creative Tasks submitted for TODAY_DATE",
  },
  {
    id: "dayEndPost1",
    label: "Day End Post",
    text: "Hi @all - End of the day TODAY_DATE\n\n- Status mail sent.\n- Daily Creative Tasks submitted.\n- File shared with Jim for the Creative Review & Quality Checks.",
  },
  {
    id: "dayEndPost2",
    label: "Day End Post (QA Review)",
    text: "Hi @all - End of the day TODAY_DATE\n\n- Status mail sent.\n- Daily Creative Tasks submitted.\n- QA Review Checking form - Nothing shareable.",
  },
  {
    id: "reviewApproved",
    label: "Review Approved",
    text: "Hello Luke Streett - We are reviewing the assets and will get back to you if needed. Could you please add Approved & Closed date on the title. its help us to set priority.",
  },
  {
    id: "checklistText2",
    label: "Checklist 2",
    text: "Please check the checklist.",
  },
  {
    id: "assetToolarge",
    label: "Assets Too Large",
    text: "Assets are too large. Could you please check the assets from MS-team link above.",
  },
  { id: "Kamal", label: "#", text: "Kamal Hossain" },
  { id: "Shahedur", label: "#", text: "Shahedur Rahman" },
  { id: "Tajul", label: "#", text: "Md. Tajul Islam" },
  { id: "Mujahidul", label: "#", text: "Md. Mujahidul Islam" },
  { id: "Imran", label: "#", text: "Imran Ahmed" },
  { id: "Emrul", label: "#", text: "Emrul Kaesh" },
  { id: "Ashiqur", label: "#", text: "Ashiqur Rahman" },
];

const Post: React.FC = () => {
  return <CopyList items={postItems} replaceTodayDate />;
};

export default Post;
