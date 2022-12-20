import type { PageServerLoad } from './$types';


;

const text = {
	introText: "Welcome to Data Dager",
	aboutText1:"Data Dagger is a platform to streamline production of and/or Quality assurance of certain datasets.",
	aboutText2:"We have created an efficient workflow to manage and control how your data is managed and who has access to it",
	aboutText3:"For now we support production of Machine learning models for classification of raster geodata. But in the future we will provide support for quality assurance of vector geodata and other forms of machine learning models (images/files)",
	howToText1:"How It works",
	howToText2:"Start by registering a User. Once you’ve done that you will have the option to create an Organization, of which you will be the administrator.",
	howToText3:"This Organization can then start different projects. You can invite others to join your Organization and they will be able to work on your different projects - Only the admins can start new projects",
	howToText4:"Navigate to the project dashboard and get to work!",
	demoText1:"Demo",
	demoText2:"Below is a map interface similar to what you’ll see in the project dashboard",
	demoText3:"It’s a basic machine learning classification model production project, click around and see what happens!",
}


export const load: PageServerLoad = async ({ }) => {
	return {
		text: text,
	};
};

