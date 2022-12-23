import { Header as HeaderContainer } from '../styles/pages/app';

import Image from 'next/image';

import { useContext, useState } from 'react';
import { PurchaseContext } from '../providers/Purchase';

import { Nav } from './Nav';

import { BsFillBagFill } from 'react-icons/bs';

import logoImg from '../assets/logo.svg';
import { useRouter } from 'next/router';
import { redirect } from 'next/dist/server/api-utils';

export const Header = () => {
  const { cart } = useContext(PurchaseContext);

  const [showNav, setShowNav] = useState(false);

  const closeNav = () => {
    setShowNav(false);
  };

  const handleOpenNav = () => {
    setShowNav(true);
  };

  const router = useRouter();
  const handleOpenHome = () => {
    router.push('/');
  };

  return (
    <HeaderContainer>
      <Image onClick={handleOpenHome} src={logoImg} alt="Logo" />
      <button onClick={handleOpenNav}>
        <BsFillBagFill />
        {cart.length > 0 && <span>{cart.length}</span>}
      </button>

      <Nav show={showNav} closeNav={closeNav} />
    </HeaderContainer>
  );
};
