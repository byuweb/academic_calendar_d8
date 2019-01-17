<?php
/**
 * @file
 * Contains \Drupal\byu_academic_calendar\Plugin\Block\AcademicCalendarBlock.
 */
namespace Drupal\byu_academic_calendar\Plugin\Block;
use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
/**
 * Provides BYU Academic Calendar block.
 *
 * @Block(
 *   id = "academic_calendar_block",
 *   admin_label = @Translation("Academic Calendar Block"),
 *   category = @Translation("Blocks")
 * )
 */
class AcademicCalendarBlock extends BlockBase {
    
    /**
     * {@inheritdoc}
     */
  
    public function blockForm($form, FormStateInterface $formState) {
        $config = $this->getConfiguration();

        $form['academic_calendar_url'] = [
          '#type' => 'textfield',
          '#default_value' => isset($config['academic_calendar_url']) ? $config['academic_calendar_url'] : '',
          '#title' => $this->t('Calendar URL'),
          '#description' => $this->t('The URL from which the calendar is pulled without the query parameters.'),
          '#required' => TRUE,
        ];

        return $form;
    }

    /**
     * {@inheritdoc}
     */

    public function blockSubmit($form, FormStateInterface $formState) {
        parent::blockSubmit($form, $formState);
        $values = $formState->getValues();
        $this->configuration['academic_calendar_url'] = $values['academic_calendar_url'];
    }

    /**
     * {@inheritdoc}
     */
    public function build() {
        $config = $this->getConfiguration();
        $baseUrl = $config['academic_calendar_url'];
        $year = intval(date("Y"));
        $thisMonth = intval(date("m"));


        $ch = curl_init();
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $html = "";
        for($y = $year - 2; $y <= $year + 1; $y++) {
            for($h = 1; $h <= 2; $h++) {
                $url = $baseUrl . "?year={$y}&half={$h}";
                curl_setopt($ch, CURLOPT_URL, $url);
                $json = curl_exec($ch);
                $calArr = json_decode($json, true);
                $calendar = isset($calArr[ "html" ]) ? $calArr[ "html" ] : "<h3>Sorry, the Academic Calendar is currently unavailable</h3>";

                if (isset($calArr[ "html" ])) {
                    $calendar = str_replace("calendar-months clearfix", "calendar-months", $calendar);
                }

                $sidebar = isset($calArr[ "sidebar" ]) ? $calArr[ "sidebar" ] : "<h3>Sorry, the Academic Calendar is currently unavailable</h3>";
                $key = isset($calArr[ "key" ]) ? $calArr[ "key" ] : "<h3>Sorry, the Academic Calendar is currently unavailable</h3>";
                $date = "<div class=\"calendar-controls\"><div class=\"year-text\">{$y}</div><div class=\"calendar-buttons\"><button class=\"calendar-prev-btn\" id=\"{$y}-{$h}-prev-btn\" name=\"previous\"><i class=\"fa fa-angle-left\" aria-hidden=\"true\"></i><span class='hidden'>previous</span></button><button class=\"calendar-next-btn\" id=\"{$y}-{$h}-next-btn\" name=\"next\"><i class=\"fa fa-angle-right\" aria-hidden=\"true\"></i><span class='hidden'>next</span></button></div></div>";
                $html .= "<div id=\"{$y}-{$h}\" class=\"hidden\">";
                $html .= $sidebar . $date . $calendar . $key;
                $html .= "</div>";
            }
        }
        curl_close($ch);
        $html .= "<a href=\"https://enrollment2.byu.edu/academic-calendar\" target=\"_blank\" id=\"academic-calendar-btn\">ACADEMIC CALENDAR</a>";

        return [
            '#type' => 'inline_template',
            '#template' => '<div class="academic-calendar">{{ content | raw }}</div>',
            '#context' => [
                'content' => $html
            ],
            '#attached' => [
                'library' => [
                    'byu_academic_calendar/byu_academic_calendar'
                 ]
            ]
        ];
    }
}
