export interface YesNoBoxProps {
  children: React.ReactNode;
  yesButtonText: string;
  noButtonText: string;
  onYes: () => void;
  onNo: () => void;
  bottomRight?: boolean;
}
