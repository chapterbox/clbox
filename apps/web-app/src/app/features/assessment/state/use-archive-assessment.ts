import { firebaseApp } from '../../firebase/firebase.app';

const firestore = firebaseApp.firestore();

export function useAssessmentArchive(team: string) {
    return (id: string) => {
        if (team) {
            (async () => {
                    const activeRef = firestore.doc(`/team/${team}/assessment/${id}`);
                    const archiveRef = firestore.doc(`/team/${team}/assessment-archive/${id}`);

                    console.log(`Trying to archive assessment: ${activeRef.path}`);

                    const active = await activeRef.get();
                    const added = await firestore.collection(`/team/${team}/assessment-archive/`)
                        .add({
                            ...active.data(),
                            originalAssessment: id,
                            originalAssessmentPath: activeRef.path,
                        })
                    await activeRef.delete();
                }
            )();
        }
    };
}
