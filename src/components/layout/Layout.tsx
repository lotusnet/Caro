
import type { VFC } from 'react';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { RecoilRoot } from 'recoil';
import Footer from './Footer';
import { Header } from "./Header";

type Props = {
  title: string,
  children: React.ReactNode;
}

export const Layout : VFC<Props> = (props: Props) => {
  const {title, children} = props;
  return (
    <>
      <RecoilRoot>
        <DndProvider backend={HTML5Backend}>
          <Header title={title} />
          <div>
          { children }
          </div>
          <Footer />
        </DndProvider>
      </RecoilRoot>
    </>
  );
}

export default Layout