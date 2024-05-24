import {create} from 'zustand';

interface UploadStore {
    uploadResponse: any; // You can replace 'any' with a more specific type if you know the structure of uploadResponse
    setUploadResponse: (response: any) => void; // Replace 'any' with the specific type if known
}

const useUploadStore = create<UploadStore>((set) => ({
    uploadResponse: null,
    setUploadResponse: (response) => set({ uploadResponse: response }),
}));

export default useUploadStore;
