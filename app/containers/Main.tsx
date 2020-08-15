import React from 'react';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';

import isEqual from 'react-fast-compare';

import { Store } from '../store';

import { HistoryItem } from '../store/upload-history/types';
import { Queue } from '../store/queue/types';

import { addToUploadHistory } from '../store/upload-history';
import { setQueue, startQueue } from '../store/queue';

import DropZone from '../components/drop-zone';
import UploadQueue from '../components/upload-queue';

interface Props {
  queue: Queue;
  uploadHistory: HistoryItem[];
  setQueue: (paths: string[]) => void;
  startQueue: () => void;
}

class Main extends React.Component<Props> {
  onDrop = async (files: File[]) => {
    const paths = files.map((f) => f.path);
    const { setQueue, startQueue } = this.props;
    setQueue(paths);
    startQueue();
  };

  componentDidUpdate(prevProps: Readonly<Props>) {
    const { queue } = this.props;
    if (!isEqual(queue, prevProps.queue)) {
      const finished = queue.find(x => !x.done) === undefined;
      if (finished) {
        new Notification('Skytron', { body: 'Upload completed!' });
      }
    }
  }

  render() {
    const { queue } = this.props;
    const inProgress = queue.find(x => !x.done) !== undefined;

    return (
      <div className="wrapper">
        <DropZone onDrop={this.onDrop} disabled={inProgress}/>
        <UploadQueue {...this.props} />
      </div>
    );
  }
}

const mapStateToProps = (state: Store) => ({
  ...state
});

export const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      addToUploadHistory,
      setQueue,
      startQueue
    },
    dispatch
  );


export default connect(mapStateToProps, mapDispatchToProps)(Main);
