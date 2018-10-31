import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AssemblyInfo, {AssemblyInfoProps} from '../../components/chapter/infos/assemblyInfo';
import * as actions from '../../action/businessComponents/chapter/chapterInfoEnterAction';
import { PersonSource } from '../../components/chapter/infos/util/selectPerson';
import {
    Spin,
} from 'antd';
const actionCreators = {
    chapterInfoDetail: actions.chapterInfoDetail,
}
interface TOwnProps {
    /**
     * 编辑 true, 查看： false
     */
    edit?: boolean;
    csId: string | number;
    className?: string;
    personSource?: PersonSource;
    panes?: AssemblyInfoProps['panes'];
}
interface TStateProps {
    data: any;
    fetching: boolean;
}
type TDispatchProps = typeof actionCreators;
type ChapterInfoEnterProps = TStateProps & TDispatchProps & TOwnProps;

class ChapterInfoEnter extends Component<ChapterInfoEnterProps> {
    constructor(props) {
        super(props);
        const {
            csId,
        } = this.props;
        this.props.chapterInfoDetail({ csId })
    }
    AssemblyInfo: AssemblyInfo | null;
    getResult = (params) => {
        if (this.AssemblyInfo) {
            return this.AssemblyInfo.getResult(params);
        }
        return false;
    }
    render() {
        const {
            className,
            edit,
            csId,
            data,
            personSource,
            fetching,
            panes,
        } = this.props;
        return (
            <div>
                {
                    fetching ?
                        <div style={{ textAlign: 'center' }}>
                            <Spin spinning />
                        </div>
                        :
                        <AssemblyInfo
                            ref={node => this.AssemblyInfo = node}
                            className={className}
                            edit={edit}
                            data={data}
                            personSource={personSource}
                            panes={panes}
                            csId={csId}
                        />
                }
            </div>
        )
    }
}

const mapStateToProps = (state: Any.Store): TStateProps => {
    const data = state.get('chapterInfoEnter');
    return {
        data: data.get('data'),
        fetching: data.get('fetching'),
    }
}

const mapDispatchToProps = (dispatch): TDispatchProps => {
    return bindActionCreators(actionCreators, dispatch);
}

const mergeProps = (stateProps, dispatchProps, parentProps) => {
    return {
        ...stateProps,
        ...parentProps,
        ...dispatchProps
    }
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps, { withRef: true })(ChapterInfoEnter);