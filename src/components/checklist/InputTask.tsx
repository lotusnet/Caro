import React from 'react';

type Props = {}

const InputTask: React.VFC<Props> = () => {
  
  return (
    <>
      <header className='header'>
        <h1>CheckList</h1>
        <form id="createForm" className="new">
            <div className="new-head">
            <h2 className="new-title">タスクを新規作成</h2>
            <button className="new-button">作成</button>
            </div>
            <label className="new-label" htmlFor="title">タイトル</label>
            <input id="title" className="new-input" name="title" />
        </form>
      </header>
      <style jsx>{`
        .header {
            display: flex;
            align-items: center;
            margin: 8px;
        }        
        .header > h1 {
            display: inline-block;
            margin: 12px 8px;
            font-size: 1.4rem;
        }        
        .new {
          padding: 20px;
          margin: 20px;
          border: 1px solid blueviolet;
        }
        .new-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .new-title {
          margin: 0;
          font-weight: bold;
          font-size: 20px;
        }
        .new-button {
          font-size: 14px;
          cursor: pointer;
          color: blueviolet;
          border: 1px solid blueviolet;
        }
        .new-label {
          font-size: 16px;
        }
        .new-input {
          width: 100%;
          margin-top: 10px;
          padding: 5px;
          font-size: 16px;
          box-sizing: border-box;
          border: 1px solid blueviolet;
        }
      `}</style>
    </>
  );
}

export default React.memo(InputTask);