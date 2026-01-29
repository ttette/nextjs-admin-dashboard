interface Props {
  isSignedOff: boolean;
  onSignOff: () => void;
}

export const SignOffButton = ({ isSignedOff, onSignOff }: Props) => {
  return (
    <button
      onClick={onSignOff}
      disabled={isSignedOff}
      className={`w-full p-2 rounded ${
        isSignedOff ? "bg-green-500" : "bg-red-500"
      } text-white`}
    >
      {isSignedOff ? "Verified" : "Sign-off"}
    </button>
  );
};
