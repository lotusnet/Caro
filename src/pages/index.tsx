import { Layout } from 'components/layout/Layout';
import Styles from 'styles/Home.module.css';

export default function Home() {
  return (<>
    <Layout title={`HOME`}>
      {/* インラインスタイル */}
      <h1 style={{color: `blue`}}>CARO</h1>
      <h2>[Check Action to Realization of  Objective]</h2>
      <p className={"title"}>これから順次公開していきます。</p>
      <p>MEMO</p>
      {/* CSS Module id,classセレクター以外は使用できない。 */}
      <h2 className={Styles.customtitle}>CUSTOM STYLE(Home.module.css)</h2>
      <h3>グローバルスタイル(globals.css)</h3>
      <input type="text" name="name" />
      <select>
        <option value="grapefruit">ちはや</option>
        <option value="lime">かずま</option>
        <option selected value="coconut">そう</option>
        <option value="mango">るい</option>
      </select>
    </Layout>
    {/* Styled JSX */}
    <style jsx>{`
      .title {
        color: crimson;
      }
      p {
        color: green;
      }
    `}</style>      
  </>)
}