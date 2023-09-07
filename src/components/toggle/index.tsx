import { styled } from '@stitches/react';

// Define the styles for the toggle switch
const ToggleWrapper = styled('label', {
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  userSelect: 'none',
  position: 'relative',
});

const ToggleInput = styled('input', {
  appearance: 'none',
  width: '40px',
  height: '20px',
  borderRadius: '20px',
  outline: 'none',
  backgroundColor: '$neutral500',
  position: 'relative',
  transition: 'background-color 0.2s ease-in-out',
  '&:checked': {
    backgroundColor: '$pink500',
  },
});

const ToggleSlider = styled('span', {
  content: "''",
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  background: 'white',
  position: 'absolute',
  top: '2px',
  transition: 'transform 0.2s ease-in-out',
  transform: 'translateX(0)',
  '&:checked': {
    transform: 'translateX(20px)',
  },
  variants: {
    chedked: {
      true: {
        right: '2px',
      },
      false: {
        left: '2px',
      },
    },
  },
});

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
}

// Create the Toggle component
const Toggle: React.FC<ToggleProps> = ({ checked, onChange }) => {
  return (
    <ToggleWrapper>
      <ToggleInput type="checkbox" checked={checked} onChange={onChange} />
      <ToggleSlider chedked={checked} />
    </ToggleWrapper>
  );
};

export default Toggle;
