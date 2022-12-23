import { styled } from '..';

export const HomeContainer = styled('main', {
  display: 'flex',
  width: '100%',
  maxWidth: 'calc(100vw - ((100vw - 1180px) / 2))',
  marginLeft: 'auto',
  minHeight: 656,
});

export const ArrowIcon = styled('svg', {
  width: 30,
  height: 30,
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50 %)',
  fill: '$white',
  cursor: 'pointer',

  variants: {
    type: {
      left: {
        left: 5,
      },
      right: {
        left: 'auto',
        right: 5,
      }
    },
    isDisabled: {
      true: {
        fill: 'rgba(255, 255, 255, 0.5)'
      }
    }
  }

});

export const ArrowRight = styled('svg', {
  width: 30,
  height: 30,
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50 %)',
  fill: '$white',
  cursor: 'pointer',

  left: 'auto',
  right: 5,
});

export const Product = styled('div', {
  background: 'linear-gradient(180deg, #1EA483 0%, #7465D4 100%)',
  borderRadius: 8,
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  img: {
    objectFit: 'cover',
  },

  footer: {
    position: 'absolute',
    bottom: '0.25rem',
    left: '0.25rem',
    right: '0.25rem',
    padding: '2rem',

    borderRadius: 6,

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',

    backgroundColor: 'rgba(0, 0, 0, 0.6)',

    transform: 'translateY(110%)',
    opacity: 0,
    transition: 'all 0.2s ease-in-out',

    strong: {
      fontSize: '$lg',
      color: '$gray100',
    },

    span: {
      fontSize: '$xl',
      fontWeight: 'bold',
      color: '$green300',
    },
  },

  '&:hover': {
    footer: {
      transform: 'translateY(0%)',
      opacity: 1,
    },
  },
});
