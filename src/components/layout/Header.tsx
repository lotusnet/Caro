import type { VFC } from 'react';

type Props = {
  title: string
}

export const Header : VFC<Props> = (props: Props) => {
  const {title} = props;
  return (
    <>      
      <div className="header-footer">
        <h1>CARO [Check Action to Realization of  Objective]</h1>
        
      </div>
      <div>
        <h3>&gt;&gt; [{title}] PAGE</h3>
      </div>
    </>
  );
};

export default Header