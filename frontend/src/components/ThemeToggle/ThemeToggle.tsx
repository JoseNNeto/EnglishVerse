import { useState } from 'react';
import { Box, Typography, ClickAwayListener } from '@mui/material';
import { useThemeMode, type ThemeMode } from '../../contexts/ThemeContext';
import { appPalette } from '../../theme/palette';
import lampadaClara from '../../assets/lampada-clara.png';
import lampadaEscura from '../../assets/lampada-escura.png';

const THEME_OPTIONS = {
  dark: {
    label: 'Escuro',
    value: 'dark' as const,
    lamp: lampadaEscura,
    backgroundColor: '#1b2a4a',
    textColor: '#f0d726',
  },
  light: {
    label: 'Claro',
    value: 'light' as const,
    lamp: lampadaClara,
    backgroundColor: '#f0d726',
    textColor: '#202a4f',
  },
};

type ThemeOption = (typeof THEME_OPTIONS)[ThemeMode];

export function ThemeToggle() {
  const { mode, setMode } = useThemeMode();
  const [open, setOpen] = useState(false);
  const selectedOption = THEME_OPTIONS[mode];
  const unselectedOption = mode === 'dark' ? THEME_OPTIONS.light : THEME_OPTIONS.dark;

  const toggleOpen = () => setOpen(prev => !prev);

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <Box
          onClick={toggleOpen}
          role="button"
          aria-label="Selecionar tema"
          aria-expanded={open}
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              toggleOpen();
            }
          }}
          sx={{
            width: 42,
            height: 42,
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: open ? '2px solid rgba(255,255,255,0.72)' : '2px solid transparent',
            backgroundColor: open ? 'rgba(27,42,74,0.68)' : 'transparent',
            boxShadow: open ? '0 0 0 2px rgba(240,215,38,0.24)' : 'none',
            transition: 'transform 0.18s ease, filter 0.18s ease, background-color 0.18s ease',
            '&:hover': {
              transform: 'scale(1.08)',
              filter: 'drop-shadow(0 0 6px rgba(255,220,80,0.52))',
            },
          }}
        >
          <img
            src={selectedOption.lamp}
            alt="Trocar tema"
            width={28}
            height={28}
            style={{ objectFit: 'contain' }}
          />
        </Box>

        {open && (
          <ThemeMenu
            selectedOption={selectedOption}
            unselectedOption={unselectedOption}
            onSelect={(value) => {
              setMode(value);
              setOpen(false);
            }}
          />
        )}
      </Box>
    </ClickAwayListener>
  );
}

function ThemeMenu({
  selectedOption,
  unselectedOption,
  onSelect,
}: {
  selectedOption: ThemeOption;
  unselectedOption: ThemeOption;
  onSelect: (value: ThemeMode) => void;
}) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 'calc(100% - 20px)',
        right: -96,
        width: 344,
        height: 254,
        zIndex: 1300,
        overflow: 'visible',
        backgroundColor: 'transparent',
        boxShadow: 'none',
        transformOrigin: 'top right',
        animation: 'theme-menu-drop 360ms cubic-bezier(.18,.88,.32,1.16) both',
        '@keyframes theme-menu-drop': {
          '0%': { opacity: 0, transform: 'translateY(-28px) scale(0.94)' },
          '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
        },
        '@keyframes selected-bubble-float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-7px)' },
        },
      }}
    >
      <HangingTheme selectedOption={selectedOption} />

      <ThemeBubble
        option={unselectedOption}
        size="small"
        left={69}
        top={88}
        lampLeft={24}
        lampTop={86}
        tailSide="left"
        onClick={() => onSelect(unselectedOption.value)}
      />

      <ThemeBubble
        option={selectedOption}
        size="large"
        left={58}
        top={163}
        tailSide="right"
        selected
        onClick={() => onSelect(selectedOption.value)}
      />
    </Box>
  );
}

function HangingTheme({ selectedOption }: { selectedOption: ThemeOption }) {
  return (
    <Box sx={{ position: 'absolute', left: 190, top: -6, width: 120, height: 253, zIndex: 3 }}>
      <Box
        sx={{
          position: 'absolute',
          left: 39,
          top: 0,
          width: 3,
          height: 189,
          borderRadius: 2,
          backgroundColor: appPalette.dark.accent,
        }}
      />
      <Typography
        sx={{
          position: 'absolute',
          left: 11,
          top: 35,
          color: appPalette.dark.accent,
          fontFamily: '"Brush Script MT", "Segoe Script", "Lucida Handwriting", cursive',
          fontSize: '2.68rem',
          fontStyle: 'italic',
          fontWeight: 400,
          lineHeight: 1,
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          textShadow: '0 2px 4px rgba(0,0,0,0.12)',
        }}
      >
        Temas
      </Typography>
      <Box
        component="img"
        src={selectedOption.lamp}
        alt=""
        sx={{
          position: 'absolute',
          left: 14,
          top: 182,
          width: 54,
          height: 54,
          objectFit: 'contain',
          transform: 'rotate(180deg)',
          filter: 'drop-shadow(0 0 10px rgba(240,215,38,0.5))',
        }}
      />
    </Box>
  );
}

function ThemeBubble({
  option,
  size,
  left,
  top,
  lampLeft,
  lampTop,
  tailSide,
  selected = false,
  onClick,
}: {
  option: ThemeOption;
  size: 'small' | 'large';
  left: number;
  top: number;
  lampLeft?: number;
  lampTop?: number;
  tailSide: 'left' | 'right';
  selected?: boolean;
  onClick: () => void;
}) {
  const large = size === 'large';

  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        '&:hover .theme-bubble': {
          transform: large ? 'scale(1.025)' : 'scale(1.045)',
        },
      }}
    >
      {lampLeft !== undefined && lampTop !== undefined && (
        <Box
          component="img"
          src={option.lamp}
          alt=""
          sx={{
            position: 'absolute',
            left: lampLeft,
            top: lampTop,
            width: 42,
            height: 42,
            objectFit: 'contain',
            filter: selected
              ? 'drop-shadow(0 0 9px rgba(240,215,38,0.55))'
              : 'drop-shadow(0 3px 5px rgba(0,0,0,0.16))',
          }}
        />
      )}

      <Box
        className="theme-bubble"
        sx={{
          position: 'absolute',
          left,
          top,
          width: large ? 158 : 130,
          height: large ? 54 : 42,
          borderRadius: large ? '16px' : '14px',
          backgroundColor: option.backgroundColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 22px rgba(0,0,0,0.2)',
          transition: 'transform 0.18s ease',
          animation: selected ? 'selected-bubble-float 3s ease-in-out infinite' : 'none',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -10,
            left: tailSide === 'left' ? 8 : 'auto',
            right: tailSide === 'right' ? 11 : 'auto',
            width: 14,
            height: 14,
            backgroundColor: option.backgroundColor,
            clipPath: tailSide === 'left'
              ? 'polygon(0 0, 100% 0, 0 100%)'
              : 'polygon(0 0, 100% 0, 100% 100%)',
          },
        }}
      >
        <Typography
          sx={{
            color: option.textColor,
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: large ? '1.52rem' : '1.1rem',
            fontWeight: 500,
            lineHeight: 1,
          }}
        >
          {option.label}
        </Typography>
      </Box>
    </Box>
  );
}
