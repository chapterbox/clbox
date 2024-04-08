import { UserAssessment } from '../model/user-assessment';
import { firebaseApp } from '../../firebase/firebase.app';
import { useCallback, useEffect, useState } from 'react';
import { WithId } from '../model/with-id';
import { UserAssessmentRef } from '../model/user-assessment-ref';

const firestore = firebaseApp.firestore();

export const useUserAssessment = (team: string, user: string, assessmentId: string, userAssessmentId: string, userAssessmentRefId: string): [WithId & UserAssessment, (update: {
    [key: string]: unknown
}) => void, (() => void)] => {
    const [assessment, setAssessment] = useState<WithId & UserAssessment | undefined>();
    useEffect(
        () => {
            if (team && user && assessmentId && userAssessmentId) {
                return firestore
                    .doc(`/team/${team}/assessment/${assessmentId}/result/${userAssessmentId}`)
                    .onSnapshot(doc => {
                        if (doc.exists) {
                            setAssessment({ id: doc.id, ...doc.data() as UserAssessment });
                        } else {
                            setAssessment(null);
                        }
                    });
            }
        },
        [team, user, assessmentId, userAssessmentId]
    );
    const updateAssessment = useCallback(
        async (update: { [key: string]: unknown }) => {
            if (team && user && assessmentId && userAssessmentId) {
                await firestore
                    .doc(`/team/${team}/assessment/${assessmentId}/result/${userAssessmentId}`)
                    .update(update);
            } else {
                throw new Error('Update for assessment without team && user && id');
            }
        },
        [team, user, assessmentId, userAssessmentId]
    );
    const finishAssessment = useCallback(
        async () => {
            await firestore.runTransaction(async (trn) => {
                const pendingDoc = firestore.doc(`/team/${team}/user/${user}/user-assessment-pending/${userAssessmentRefId}`);
                const sentDoc = firestore.doc(`/team/${team}/user/${user}/user-assessment-sent/${userAssessmentRefId}`);

                const sent = await trn.get(sentDoc);
                if (!sent.exists) {
                    const finishedAssessment = await trn.get(pendingDoc);
                    trn.set(sentDoc, {
                        ...finishedAssessment.data(),
                        finished: true,
                        finishedDate: new Date().getTime()
                    } as UserAssessmentRef);
                }
            });
        },
        [team, user, userAssessmentRefId]
    );
    return [assessment, updateAssessment, finishAssessment];
};
