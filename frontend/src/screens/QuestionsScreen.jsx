import AppHeader from '../components/AppHeader';
import PageTitle from '../components/PageTitle';
import MissingInfoQuestions from '../components/questions/MissingInfoQuestions';
import styles from './QuestionsScreen.module.css';

export default function QuestionsScreen({
  decoded,
  missing,
  options,
  matches,
  answers,
  onAnswer,
  onBack,
  onHome,
  onSignOut,
  isRefining,
  isGuest = false,
  onLogin,
}) {
  if (!missing || missing.length === 0) return null;

  const totalQuestions = missing.length;
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / totalQuestions) * 100;

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <AppHeader
          showBackButton={true}
          onBack={onBack}
          onHome={onHome}
          onSignOut={onSignOut}
          isGuest={isGuest}
          onLogin={onLogin}
        />

        <PageTitle>Refine Your Results</PageTitle>
        {/* Progress Bar */}
        <div className={styles.progressBarContainer}>
          <div className={styles.progressBarFill} style={{ width: `${progress}%` }} />
        </div>

        {/* Vehicle Card */}
        <div className={styles.vehicleCard}>
          <div className={styles.vehicleIconBox}>🚙</div>
          <div className={styles.vehicleInfo}>
            <div className={styles.vehicleTitle}>
              {decoded.year} {decoded.make}
            </div>
            <div className={styles.vehicleSubtitle}>
              {decoded.model} {decoded.series}
            </div>
          </div>
        </div>

        {/* Step Counter */}
        <div className={styles.stepCounter}>
          Question {answeredCount + 1} of {totalQuestions}
        </div>

        {/* Header */}
        <h2 className={styles.heading}>We need a bit more information</h2>

        <p className={styles.description}>This helps us determine your exact towing capacity.</p>

        {/* Render the questions */}
        <MissingInfoQuestions
          missing={missing}
          options={options}
          matches={matches}
          decoded={decoded}
          currentAnswers={answers}
          onAnswer={onAnswer}
          isLoading={isRefining}
        />
      </div>
    </div>
  );
}
