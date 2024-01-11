import { Layout } from 'components/layout/Layout';
import { VFC } from 'react';

export type NoteContentValues = {
  content: string;
  weather: string;
  condition: string;
  opponent: string;
  toDo: string;
};

export const Note : VFC = () => {
  return (<>
    <Layout title={`Note`}>
      <h1>Note</h1>
      <div>
        <select>
          <option value="traning-match">TRM</option>
          <option value="traing">TR</option>
          <option value="match">MATCH</option>
          <option value="event">EVENT</option>
        </select>
        <select>
          <option value="sunny">晴れ</option>
          <option value="cloudy">曇り</option>
          <option selected value="rain">雨</option>
        </select>
        <select>
          <option value="good">良好</option>
          <option value="usually">普通</option>
          <option selected value="bad">不良</option>
        </select>
      </div>
    </Layout>
  </>)
}

export default Note